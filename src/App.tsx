import { useEffect, useMemo, useState } from 'react';

type Offer = {
    id: string;
    title: string;
    details: string;
    expiresAt: string;
};

type Account = {
    id: string;
    phone: string;
    credits: number;
    discount: number;
    createdAt: string;
    offers?: Offer[];
};

const STORAGE_KEY = 'dsy02-accounts';

function formatPhone(phone: string) {
    return phone;
}

function App() {
    const [accounts, setAccounts] = useState<Account[]>(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved ? (JSON.parse(saved) as Account[]) : [];
        } catch {
            return [];
        }
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [newCredits, setNewCredits] = useState('0');
    const [newDiscount, setNewDiscount] = useState('0');
    const [draftCredits, setDraftCredits] = useState('');
    const [draftDiscount, setDraftDiscount] = useState('');
    const [offerTitle, setOfferTitle] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [offerExpiry, setOfferExpiry] = useState('');
    const [offerNotice, setOfferNotice] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }, [accounts]);

    const selectedAccount = accounts.find((account) => account.id === selectedId) ?? null;
    const visibleAccounts = useMemo(() => {
        const needle = query.replace(/\s/g, '').toLowerCase();
        return accounts.filter((account) => account.phone.replace(/\s/g, '').toLowerCase().includes(needle));
    }, [accounts, query]);
    const totalCredits = accounts.reduce((total, account) => total + account.credits, 0);
    const averageDiscount = accounts.length
        ? accounts.reduce((total, account) => total + account.discount, 0) / accounts.length
        : 0;

    function selectAccount(account: Account) {
        setSelectedId(account.id);
        setDraftCredits(String(account.credits));
        setDraftDiscount(String(account.discount));
        setOfferTitle('');
        setOfferDetails('');
        setOfferExpiry('');
        setOfferNotice('');
        setNotice('');
    }

    function addAccount(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const phone = phoneInput.trim();
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
            setNotice('Enter a valid phone number with 7 to 15 digits.');
            return;
        }
        if (accounts.some((account) => account.phone.replace(/\D/g, '') === digits)) {
            setNotice('An account with that phone number already exists.');
            return;
        }

        const account: Account = {
            id: window.crypto.randomUUID(),
            phone,
            credits: Number(newCredits) || 0,
            discount: Number(newDiscount) || 0,
            createdAt: new Date().toISOString(),
            offers: [],
        };
        setAccounts((current) => [account, ...current]);
        selectAccount(account);
        setPhoneInput('');
        setNewCredits('0');
        setNewDiscount('0');
        setShowAddForm(false);
        setNotice('Account added.');
    }

    function saveAccount(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedAccount) return;
        const credits = Number(draftCredits);
        const discount = Number(draftDiscount);
        if (!Number.isFinite(credits) || credits < 0 || !Number.isFinite(discount) || discount < 0 || discount > 100) {
            setNotice('Credits must be 0 or more and discount must be between 0 and 100.');
            return;
        }
        setAccounts((current) => current.map((account) => account.id === selectedAccount.id
            ? { ...account, credits, discount }
            : account));
        setNotice('Account updated.');
    }

    function addOffer(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedAccount || !offerTitle.trim()) return;

        const offer: Offer = {
            id: window.crypto.randomUUID(),
            title: offerTitle.trim(),
            details: offerDetails.trim(),
            expiresAt: offerExpiry,
        };
        setAccounts((current) => current.map((account) => account.id === selectedAccount.id
            ? { ...account, offers: [...(account.offers ?? []), offer] }
            : account));
        setOfferTitle('');
        setOfferDetails('');
        setOfferExpiry('');
        setOfferNotice('Offer added. A little something extra, officially.');
    }

    function removeOffer(offerId: string) {
        if (!selectedAccount) return;
        setAccounts((current) => current.map((account) => account.id === selectedAccount.id
            ? { ...account, offers: (account.offers ?? []).filter((offer) => offer.id !== offerId) }
            : account));
        setOfferNotice('Offer removed. The next good idea is already waiting.');
    }

    return (
        <main className="app-shell">
            <aside className="sidebar">
                <div className="brand-lockup">
                    <span className="brand-mark">d</span>
                    <div><strong>daylight</strong><span>MEMBER DESK</span></div>
                </div>
                <div className="side-section-label">WORKSPACE</div>
                <div className="nav-item active"><span className="nav-icon">▦</span>Accounts <span className="nav-count">{accounts.length}</span></div>
                <div className="sidebar-bottom"><span className="status-dot" /> Local account book <span className="sync-label">SAVED</span></div>
            </aside>

            <section className="workspace">
                <header className="topbar">
                    <div className="breadcrumb">Workspace <span>/</span> <strong>Accounts</strong></div>
                    <div className="topbar-right"><span className="date-label">STORE CREDIT</span><span className="avatar">D</span></div>
                </header>

                <div className="page-content">
                    <div className="page-heading">
                        <div>
                            <div className="eyebrow">CUSTOMER RELATIONSHIPS</div>
                            <h1>Accounts <span className="heading-period">.</span></h1>
                            <p className="page-description">Keep every member's credits, perks, and little surprises in one place.</p>
                        </div>
                        <button className="primary-button" onClick={() => { setShowAddForm(true); setNotice(''); }}>
                            <span className="plus-icon">+</span> Add account
                        </button>
                    </div>

                    <section className="stats-grid" aria-label="Account summary">
                        <article className="stat-card stat-green">
                            <div className="stat-top"><span>MEMBERS</span><span className="stat-symbol">◎</span></div>
                            <div className="stat-value">{accounts.length.toLocaleString()}</div>
                            <div className="stat-caption">accounts on file</div>
                        </article>
                        <article className="stat-card stat-white">
                            <div className="stat-top"><span>CREDITS OUTSTANDING</span><span className="stat-symbol">◈</span></div>
                            <div className="stat-value">{totalCredits.toLocaleString()}</div>
                            <div className="stat-caption">credits across all members</div>
                        </article>
                        <article className="stat-card stat-coral">
                            <div className="stat-top"><span>AVERAGE DISCOUNT</span><span className="stat-symbol">%</span></div>
                            <div className="stat-value">{averageDiscount.toFixed(1)}<small>%</small></div>
                            <div className="stat-caption">across active accounts</div>
                        </article>
                    </section>

                    <div className="content-grid">
                        <section className="accounts-panel">
                            <div className="panel-heading">
                                <div><h2>Member directory</h2><span>{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</span></div>
                                <label className="search-box">
                                    <span className="search-icon">⌕</span>
                                    <input aria-label="Search phone numbers" placeholder="Find by phone" value={query} onChange={(event) => setQuery(event.target.value)} />
                                    {query && <button className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}>×</button>}
                                </label>
                            </div>
                            <div className="table-head"><span>PHONE NUMBER</span><span>CREDITS</span><span>DISCOUNT</span><span>ADDED</span></div>
                            <div className="account-list">
                                {visibleAccounts.map((account) => (
                                    <button key={account.id} className={`account-row ${selectedId === account.id ? 'selected' : ''}`} onClick={() => selectAccount(account)}>
                                        <span className="phone-cell"><span className="phone-avatar">{account.phone.replace(/\D/g, '').slice(-2) || '··'}</span><span>{formatPhone(account.phone)}</span></span>
                                        <span className="credit-cell">{account.credits.toLocaleString()}</span>
                                        <span><span className="discount-pill">{account.discount}%</span></span>
                                        <span className="date-cell">{new Date(account.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </button>
                                ))}
                                {visibleAccounts.length === 0 && (
                                    <div className="empty-state">
                                        <span className="empty-mark">◎</span>
                                        <strong>{query ? 'No matching members' : 'Your member list starts here'}</strong>
                                        <p>{query ? 'Try another phone number.' : 'Add a phone number to create the first account.'}</p>
                                        {!query && <button className="text-button" onClick={() => setShowAddForm(true)}>Add your first account <span>→</span></button>}
                                    </div>
                                )}
                            </div>
                        </section>

                        <aside className="detail-panel">
                            {selectedAccount ? (
                                <div>
                                    <form onSubmit={saveAccount}>
                                        <div className="detail-kicker">ACCOUNT DETAILS <button type="button" className="close-detail" aria-label="Close account details" onClick={() => setSelectedId(null)}>×</button></div>
                                        <div className="member-avatar">{selectedAccount.phone.replace(/\D/g, '').slice(-2)}</div>
                                        <h2 className="detail-phone">{selectedAccount.phone}</h2>
                                        <div className="member-since">Member since {new Date(selectedAccount.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                        <div className="detail-divider" />
                                        <label className="field-label" htmlFor="credits">STORE CREDITS</label>
                                        <div className="number-field"><input id="credits" type="number" min="0" step="1" value={draftCredits} onChange={(event) => setDraftCredits(event.target.value)} /><span>credits</span></div>
                                        <p className="field-hint">A handy little balance for their next visit.</p>
                                        <label className="field-label discount-label" htmlFor="discount">MEMBER DISCOUNT</label>
                                        <div className="number-field"><input id="discount" type="number" min="0" max="100" step="1" value={draftDiscount} onChange={(event) => setDraftDiscount(event.target.value)} /><span>%</span></div>
                                        <p className="field-hint">Applied to eligible purchases.</p>
                                        <button type="submit" className="save-button">Save changes <span>→</span></button>
                                        {notice && <p className="notice" role="status">{notice}</p>}
                                    </form>

                                    <section className="offer-section">
                                        <div className="offer-heading"><div><h3>Little extras</h3><p>Offers just for this member.</p></div><span className="offer-count">{(selectedAccount.offers ?? []).length}</span></div>
                                        {(selectedAccount.offers ?? []).length > 0 ? (
                                            <div className="offer-list">
                                                {(selectedAccount.offers ?? []).map((offer) => (
                                                    <article className="offer-card" key={offer.id}>
                                                        <div className="offer-card-top"><strong>{offer.title}</strong><button type="button" className="remove-offer" aria-label={`Remove ${offer.title}`} onClick={() => removeOffer(offer.id)}>×</button></div>
                                                        {offer.details && <p>{offer.details}</p>}
                                                        <span className="offer-expiry">{offer.expiresAt ? `Until ${new Date(`${offer.expiresAt}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` : 'No expiration date'}</span>
                                                    </article>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="offer-empty">No offers yet. This is your cue to make someone's day.</p>
                                        )}
                                        <form className="offer-form" onSubmit={addOffer}>
                                            <label className="field-label" htmlFor="offer-title">OFFER NAME</label>
                                            <input className="text-field" id="offer-title" maxLength={48} placeholder="A free coffee, perhaps?" value={offerTitle} onChange={(event) => setOfferTitle(event.target.value)} required />
                                            <label className="field-label offer-note-label" htmlFor="offer-details">A LITTLE MORE DETAIL <span>OPTIONAL</span></label>
                                            <input className="text-field" id="offer-details" maxLength={100} placeholder="Any details worth remembering" value={offerDetails} onChange={(event) => setOfferDetails(event.target.value)} />
                                            <label className="field-label offer-note-label" htmlFor="offer-expiry">GOOD UNTIL <span>OPTIONAL</span></label>
                                            <input className="text-field" id="offer-expiry" type="date" value={offerExpiry} onChange={(event) => setOfferExpiry(event.target.value)} />
                                            <button type="submit" className="offer-submit"><span>+</span> Add an offer</button>
                                            {offerNotice && <p className="offer-notice" role="status">{offerNotice}</p>}
                                        </form>
                                    </section>
                                </div>
                            ) : (
                                <div className="detail-empty"><span className="detail-empty-icon">↖</span><strong>Select a member</strong><p>Choose someone from the directory to tune their perks. Good things start with a phone number.</p></div>
                            )}
                        </aside>
                    </div>
                    {notice && !selectedAccount && <div className="global-notice" role="status">{notice}</div>}
                </div>
            </section>

            {showAddForm && (
                <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddForm(false); }}>
                    <form className="add-modal" onSubmit={addAccount}>
                        <div className="modal-topline"><span>NEW MEMBER</span><button type="button" className="close-detail" aria-label="Close" onClick={() => setShowAddForm(false)}>×</button></div>
                        <h2>Add an account</h2>
                        <p className="modal-description">A phone number is all you need to get started.</p>
                        <label className="field-label" htmlFor="phone">PHONE NUMBER</label>
                        <input className="text-field" id="phone" type="tel" autoFocus placeholder="e.g. +1 555 010 2040" value={phoneInput} onChange={(event) => setPhoneInput(event.target.value)} required />
                        <div className="modal-fields">
                            <div><label className="field-label" htmlFor="starting-credits">STARTING CREDITS</label><input className="text-field" id="starting-credits" type="number" min="0" step="1" value={newCredits} onChange={(event) => setNewCredits(event.target.value)} /></div>
                            <div><label className="field-label" htmlFor="starting-discount">DISCOUNT</label><div className="percent-input"><input className="text-field" id="starting-discount" type="number" min="0" max="100" step="1" value={newDiscount} onChange={(event) => setNewDiscount(event.target.value)} /><span>%</span></div></div>
                        </div>
                        {notice && <p className="modal-error" role="alert">{notice}</p>}
                        <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button><button type="submit" className="primary-button">Create account <span>→</span></button></div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default App;