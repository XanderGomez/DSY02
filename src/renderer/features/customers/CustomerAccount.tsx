export type CustomerAccountDetails = {
  id: number;
  name: string;
  email: string;
  phone: string;
  /** Available store credit in dollars. */
  creditBalance: number;
};

export type CustomerAccountProps = {
  customer: CustomerAccountDetails;
  onTradeIn: () => void;
  onTradeOut: () => void;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function TradeIcon({ direction }: { direction: 'in' | 'out' }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M4 15v5h16v-5" />
      {direction === 'in' ? (
        <path d="M12 3v12m-5-5 5 5 5-5" />
      ) : (
        <path d="M12 15V3M7 8l5-5 5 5" />
      )}
    </svg>
  );
}

function CustomerAccount({
  customer,
  onTradeIn,
  onTradeOut,
}: CustomerAccountProps) {
  return (
    <main className="bg-[#e6f0e5] text-stone-900">

      <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12">
        <section aria-labelledby="credit-balance-title" className="rounded-xl border border-emerald-200 bg-[#f3f8f1] px-5 py-8 shadow-sm shadow-emerald-950/5 sm:px-8 sm:py-10">
          <h1 className="text-sm font-semibold text-emerald-950" id="credit-balance-title">
            Available store credit
          </h1>
          <p aria-live="polite" aria-atomic="true" className="mt-3 break-words text-5xl font-semibold tracking-tight text-emerald-950 tabular-nums sm:text-6xl">
            {currencyFormatter.format(customer.creditBalance)}
          </p>
          <p className="mt-3 text-sm text-stone-600">Use this balance toward store purchases.</p>

          <div className="mt-8 border-t border-emerald-200 pt-5 sm:mt-10">
            <h2 className="break-words text-base font-semibold text-stone-800">
              {customer.name.trim() || customer.phone}
            </h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 sm:gap-6">
              <div className="min-w-0">
                <dt className="text-xs text-stone-500">Phone number</dt>
                <dd className="mt-1 break-words text-stone-600">{customer.phone || 'Not provided'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-stone-500">Email</dt>
                <dd className="mt-1 break-words text-stone-600">{customer.email || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            className="flex min-h-36 items-center gap-4 rounded-xl border border-emerald-800 bg-emerald-800 px-5 py-6 text-left text-white shadow-sm shadow-emerald-950/5 transition-colors hover:border-emerald-900 hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 sm:px-6"
            onClick={onTradeIn}
            type="button"
          >
            <TradeIcon direction="in" />
            <span>
              <span className="block text-lg font-semibold tracking-tight">Trade in</span>
              <span className="mt-1 block text-sm text-emerald-100">Exchange items for store credit.</span>
            </span>
          </button>
          <button
            className="flex min-h-36 items-center gap-4 rounded-xl border border-emerald-800 bg-emerald-800 px-5 py-6 text-left text-white shadow-sm shadow-emerald-950/5 transition-colors hover:border-emerald-900 hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 sm:px-6"
            onClick={onTradeOut}
            type="button"
          >
            <TradeIcon direction="out" />
            <span>
              <span className="block text-lg font-semibold tracking-tight">Trade out</span>
              <span className="mt-1 block text-sm text-emerald-100">Use store credit to buy products.</span>
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default CustomerAccount;
