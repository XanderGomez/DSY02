import type { TradeFields } from '../../../shared/contracts/credit';
import type { CustomerAccountDetails } from '../customers/CustomerAccount';

export type TradePageProps = {
  customer: CustomerAccountDetails;
  onSubmit: (fields: TradeFields) => void;
};

export default function TradeAccountContext({ customer }: Pick<TradePageProps, 'customer'>) {
  return (
    <div className="mb-6 border-b border-emerald-200 pb-5">
      <p className="break-words text-sm text-stone-600">
        <span className="font-semibold text-emerald-950">{customer.name || customer.phone}</span>
        {' · Available credit: '}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.balanceCents / 100)}
      </p>
    </div>
  );
}
