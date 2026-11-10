import { useState, type FormEvent } from 'react';
import TradeAccountContext, { type TradePageProps } from './TradeAccountContext';
import { rankTradeCategories, type CategoryTradeCounts } from './tradeCategories';

const fieldClass = 'mt-2 block w-full rounded-md border border-emerald-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20';
const buttonClass = 'rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800';
function filterClass(selected: boolean) {
  return `min-h-11 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-emerald-200 bg-white text-emerald-950 hover:bg-emerald-100'}`;
}

export default function TradeOutPage({ customer, categoryTradeCounts }: TradePageProps & { categoryTradeCounts?: CategoryTradeCounts }) {
  const [category, setCategory] = useState('');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  // Each page receives counts for its own trade direction only.
  const rankedCategories = rankTradeCategories('out', categoryTradeCounts);
  const topCategories = rankedCategories.slice(0, 3);
  const moreCategories = rankedCategories.slice(3);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [posTransactionId, setPosTransactionId] = useState('');
  const [error, setError] = useState('');
  const [reviewed, setReviewed] = useState(false);
  function clearSelection() {
    setError('');
    setReviewed(false);
  }

  function reviewForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewed(false);
    if (!category || !itemName.trim()) {
      setError('Choose a category and enter the item name.');
      return;
    }
    if (!posTransactionId.trim()) {
      setError('Enter the related POS transaction ID.');
      return;
    }
    const value = amount.trim();
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setError('Enter a positive dollar amount with up to two decimal places, such as 12.50.');
      return;
    }
    const [dollars, cents = ''] = value.split('.');
    const amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, '0'));
    if (!Number.isSafeInteger(amountCents) || amountCents < 1) {
      setError('Enter a valid amount of at least $0.01.');
      return;
    }
    setError('');
    setAmount(`${Math.floor(amountCents / 100)}.${String(amountCents % 100).padStart(2, '0')}`);
    setReviewed(true);
  }

  function resetForm() {
    setCategory('');
    setShowMoreCategories(false);
    setItemName('');
    setDescription('');
    setAmount('');
    setPosTransactionId('');
    clearSelection();
  }

  return (
    <main className="bg-[#e6f0e5] pb-12 text-stone-900">
      <section className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] p-5 shadow-sm sm:mt-12 sm:p-8">
        <TradeAccountContext customer={customer} />
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Trade out</h1>
        <p className="mt-2 text-sm text-stone-600">Describe the item being traded out and enter its agreed trade amount.</p>
        <form className="mt-7" onSubmit={reviewForm}>
          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-emerald-950">Category <span className="text-red-700">*</span></legend>
            <p className="mt-2 text-sm text-stone-600">Choose the item type, or select General if it is not listed.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {topCategories.map((value) => <button type="button" key={value} className={filterClass(category === value)} aria-pressed={category === value} onClick={() => { setCategory(value); clearSelection(); }}>{value}</button>)}
            </div>
            <button type="button" className="mt-2 rounded px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2" aria-expanded={showMoreCategories} aria-controls="more-trade-out-categories" onClick={() => setShowMoreCategories((current) => !current)}>{showMoreCategories ? 'Show less' : 'Show more'}</button>
            <div id="more-trade-out-categories" hidden={!showMoreCategories}>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {moreCategories.map((value) => <button type="button" key={value} className={filterClass(category === value)} aria-pressed={category === value} onClick={() => { setCategory(value); clearSelection(); }}>{value}</button>)}
              </div>
            </div>
            {!showMoreCategories && moreCategories.includes(category) && <p className="mt-2 text-sm text-emerald-900">Selected: {category}</p>}
          </fieldset>
          <label className="mt-6 block text-sm font-medium text-emerald-950" htmlFor="trade-item-name">Item name <span className="text-red-700">*</span></label>
          <input id="trade-item-name" className={fieldClass} required maxLength={200} placeholder="Enter the item being traded out" value={itemName} onChange={(event) => { setItemName(event.target.value); clearSelection(); }} />
          <label className="mt-5 block text-sm font-medium text-emerald-950" htmlFor="trade-description">Description / notes <span className="font-normal text-stone-500">(optional)</span></label>
          <textarea id="trade-description" className={fieldClass} rows={3} maxLength={2000} placeholder="Edition, condition, or other details about the trade" value={description} onChange={(event) => { setDescription(event.target.value); clearSelection(); }} />
          <label className="mt-5 block text-sm font-medium text-emerald-950" htmlFor="trade-amount">Agreed trade amount (USD) <span className="text-red-700">*</span></label>
          <input id="trade-amount" className={`${fieldClass} max-w-xs`} type="text" inputMode="decimal" required placeholder="0.00" aria-describedby="trade-amount-help" value={amount} onChange={(event) => { setAmount(event.target.value); clearSelection(); }} />
          <p id="trade-amount-help" className="mt-2 text-xs text-stone-600">Enter the employee-determined amount in dollars and cents.</p>
          <label className="mt-5 block text-sm font-medium text-emerald-950" htmlFor="trade-pos-transaction-id">POS transaction ID <span className="text-red-700">*</span></label>
          <input id="trade-pos-transaction-id" name="posTransactionId" className={fieldClass} type="text" required maxLength={200} placeholder="Enter the related POS transaction ID" aria-describedby="trade-pos-transaction-id-help" value={posTransactionId} onChange={(event) => { setPosTransactionId(event.target.value); clearSelection(); }} />
          <p id="trade-pos-transaction-id-help" className="mt-2 text-xs text-stone-600">For tracking: reference the POS transaction associated with this trade out.</p>
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          {reviewed && <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-100 p-3 text-sm text-emerald-950" role="status">Form checked. The trade-out details are valid. This preview has not saved or processed a trade.</p>}
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-emerald-200 pt-5">
            <button className="rounded-md px-4 py-2.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2" type="button" onClick={resetForm}>Clear form</button>
            <button className={buttonClass} type="submit">Check form</button>
          </div>
        </form>
      </section>
    </main>
  );
}
