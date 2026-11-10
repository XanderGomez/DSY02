import type { CustomerAccountDetails } from './CustomerAccount';

export type TradePageProps = {
  customer?: CustomerAccountDetails;
};

export default function TradeAccountContext({ customer }: TradePageProps) {
  if (!customer) return null;
  return (
    <div className="mb-6 border-b border-emerald-200 pb-5">
      <p className="break-words text-sm text-stone-600">
        <span className="font-semibold text-emerald-950">{customer.name || customer.phone}</span>
        {' · Available credit: '}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.creditBalance)}
      </p>
    </div>
  );
}
