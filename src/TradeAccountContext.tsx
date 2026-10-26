import type { CustomerAccountDetails } from './CustomerAccount';

export type TradePageProps = {
  customer?: CustomerAccountDetails;
  onBackToAccount?: () => void;
};

export default function TradeAccountContext({ customer, onBackToAccount }: TradePageProps) {
  if (!customer && !onBackToAccount) return null;
  return (
    <div className="mb-6 border-b border-emerald-200 pb-5">
      {onBackToAccount && <button type="button" onClick={onBackToAccount} className="mb-3 rounded-md px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-800">Back to account</button>}
      {customer && <p className="break-words text-sm text-stone-600">
        <span className="font-semibold text-emerald-950">{customer.name || customer.phone}</span>
        {' · Available credit: '}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.creditBalance)}
      </p>}
    </div>
  );
}
