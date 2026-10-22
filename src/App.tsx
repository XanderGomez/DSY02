import { useMemo, useState, type FormEvent } from 'react';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

const initialCustomers: Customer[] = [
  { id: 1, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(503) 555-0142' },
  { id: 2, name: 'Noah Williams', email: 'noah.williams@email.com', phone: '(503) 555-0188' },
  { id: 3, name: 'Ava Martinez', email: 'ava.martinez@email.com', phone: '(971) 555-0126' },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const matchingCustomers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');

    if (!searchTerm) {
      return [];
    }

    return customers.filter((customer) => {
      const matchesText = [customer.name, customer.email, customer.phone].some(
        (value) => value.toLowerCase().includes(searchTerm),
      );
      const matchesPhone = digits.length > 0
        && customer.phone.replace(/\D/g, '').includes(digits);

      return matchesText || matchesPhone;
    });
  }, [customers, query]);

  function handleSearchChange(value: string) {
    setQuery(value);
    setSelectedCustomer(null);
  }

  function handleCreateCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get('phone')).trim();
    const normalizedPhone = phone.replace(/\D/g, '');

    if (!normalizedPhone) {
      setCreateError('Enter a valid phone number.');
      return;
    }

    if (customers.some((customer) => customer.phone.replace(/\D/g, '') === normalizedPhone)) {
      setCreateError('An account with this phone number already exists.');
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      name: String(formData.get('name')).trim(),
      email: String(formData.get('email')).trim(),
      phone,
    };

    setCustomers((currentCustomers) => [customer, ...currentCustomers]);
    setQuery(phone);
    setSelectedCustomer(customer.id);
    setCreateError('');
    setIsCreating(false);
  }

  function handleLeaveAccount() {
    setQuery('');
    setSelectedCustomer(null);
  }

  return (
    <main className="min-h-screen bg-[#e6f0e5] text-stone-900">
      <header className="flex h-16 items-center justify-between border-b border-emerald-950 bg-emerald-950 px-5 text-white sm:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />
          Dragon&apos;s Lair
        </span>
        <button
          className="rounded-md px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          onClick={handleLeaveAccount}
          type="button"
        >
          Leave account
        </button>
      </header>

      <section className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] px-5 pb-16 pt-8 shadow-sm shadow-emerald-950/5 sm:mt-12 sm:px-8 sm:pt-10">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Find a customer</h1>
          <p className="mt-2 text-sm text-stone-600">Search by name, email, or phone number.</p>

          <label className="mt-7 block text-sm font-medium text-emerald-950" htmlFor="customer-search">
            Customer search
          </label>
          <label className="mt-2 flex min-h-14 items-center gap-3 rounded-lg border-2 border-emerald-700 bg-emerald-50 px-4 shadow-sm shadow-emerald-950/5 focus-within:ring-4 focus-within:ring-emerald-800/20">
            <span className="text-emerald-800 [&_svg]:stroke-current [&_svg]:stroke-[1.8]">
              <SearchIcon />
            </span>
            <input
              autoComplete="off"
              className="w-full border-0 bg-transparent text-base outline-none placeholder:text-stone-400"
              id="customer-search"
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Enter a name, email, or phone number"
              type="search"
              value={query}
            />
          </label>
          <div className="mt-3 flex justify-end">
            <button
              className="rounded-md border border-emerald-700/40 bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-950 hover:border-emerald-700 hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              onClick={() => {
                setCreateError('');
                setIsCreating(true);
              }}
              type="button"
            >
              Create account
            </button>
          </div>
        </div>

        <div aria-live="polite" className="mt-9 max-w-2xl">
          {query.trim() ? (
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-sm font-semibold text-stone-800">
                {matchingCustomers.length
                  ? `Possible matches (${matchingCustomers.length})`
                  : 'No matches'}
              </h2>
            </div>
          ) : (
            <h2 className="border-b border-stone-200 pb-3 text-sm font-semibold text-stone-800">
              Customers
            </h2>
          )}

          {query.trim() && matchingCustomers.length > 0 ? (
            <ul className="divide-y divide-emerald-100 rounded-b-lg border-x border-b border-emerald-200 bg-emerald-50">
              {matchingCustomers.map((customer) => {
                const isSelected = selectedCustomer === customer.id;
                const displayName = customer.name || customer.phone;
                const contactDetails = [
                  customer.name ? customer.phone : '',
                  customer.email,
                ].filter(Boolean).join(' · ');

                return (
                  <li key={customer.id}>
                    <button
                      aria-pressed={isSelected}
                      className={`group flex min-h-[72px] w-full items-center justify-between gap-4 px-4 text-left transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-700 ${isSelected ? 'bg-emerald-100' : 'bg-emerald-50'}`}
                      onClick={() => setSelectedCustomer(isSelected ? null : customer.id)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-stone-900">{displayName}</span>
                        {contactDetails && (
                          <span className="mt-1 block truncate text-xs text-stone-500">{contactDetails}</span>
                        )}
                      </span>
                      <svg
                        aria-hidden="true"
                        className={`size-5 shrink-0 stroke-current transition-transform group-hover:translate-x-0.5 ${isSelected ? 'text-emerald-800' : 'text-stone-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() ? (
            <div className="rounded-b-lg border-x border-b border-stone-200 bg-white px-4 py-6">
              <p className="text-sm text-stone-600">No customers found for “{query.trim()}”.</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-b-lg border-x border-b border-emerald-200 bg-emerald-100/80 px-4 py-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-900 [&_svg]:size-4 [&_svg]:stroke-current [&_svg]:stroke-[1.8]">
                <SearchIcon />
              </span>
              <p className="text-sm text-stone-600">Start typing to search</p>
            </div>
          )}
        </div>
      </section>

      {isCreating && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-stone-950/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsCreating(false);
            }
          }}
        >
          <section
            aria-labelledby="create-account-title"
            aria-modal="true"
            className="w-full max-w-md rounded-lg border border-emerald-200 border-t-4 border-t-emerald-700 bg-white p-6 shadow-xl sm:p-7"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight" id="create-account-title">Create account</h2>
                <p className="mt-1 text-sm text-stone-600">Enter a phone number to create a customer account.</p>
              </div>
              <button
                aria-label="Close"
                className="rounded p-1 text-xl leading-none text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreateCustomer}>
              <label className="block text-sm font-medium text-stone-700">
                Phone number <span className="text-red-700">*</span>
                <input
                  autoComplete="tel"
                  className="mt-1.5 block h-11 w-full rounded-md border border-stone-300 px-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  name="phone"
                  placeholder="(555) 555-5555"
                  required
                  type="tel"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Name <span className="font-normal text-stone-400">Optional</span>
                <input
                  autoComplete="name"
                  className="mt-1.5 block h-11 w-full rounded-md border border-stone-300 px-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  name="name"
                  placeholder="Customer name"
                  type="text"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Email <span className="font-normal text-stone-400">Optional</span>
                <input
                  autoComplete="email"
                  className="mt-1.5 block h-11 w-full rounded-md border border-stone-300 px-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                />
              </label>

              {createError && <p className="text-sm text-red-700" role="alert">{createError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="rounded-md px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                  onClick={() => setIsCreating(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                  type="submit"
                >
                  Create account
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
