import type { Trade } from './transactions';
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export default function TransactionReceipt({ selectedTrade, onClose }: { selectedTrade: Trade; onClose: () => void }) {
  return (
              <section aria-labelledby="transaction-receipt-title" className="mx-auto mt-5 max-w-xl rounded-lg border border-emerald-200 bg-white p-5 shadow-sm" aria-live="polite">
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-emerald-200 pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Transaction receipt</p>
                    <h3 className="mt-1 text-lg font-semibold text-emerald-950" id="transaction-receipt-title">{selectedTrade.id}</h3>
                    <p className="mt-1 text-xs text-stone-500">{selectedTrade.day} · {selectedTrade.time}</p>
                  </div>
                  <button
                    aria-label="Close transaction receipt"
                    className="rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-800"
                    onClick={onClose}
                    type="button"
                  >
                    Close
                  </button>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-dashed border-emerald-200 py-4 text-sm">
                  <div>
                    <dt className="text-xs text-stone-500">POS transaction ID</dt>
                    <dd className="mt-1 break-all font-medium text-stone-800">{selectedTrade.posTransactionId || 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">Transaction type</dt>
                    <dd className="mt-1 font-medium text-stone-800">{selectedTrade.kind}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">Customer account</dt>
                    <dd className="mt-1 font-medium text-stone-800">{selectedTrade.account}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">Employee</dt>
                    <dd className="mt-1 font-medium text-stone-800">{selectedTrade.employee} · #{selectedTrade.employeeId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">Store</dt>
                    <dd className="mt-1 font-medium text-stone-800">{selectedTrade.store}</dd>
                  </div>
                </dl>
                <div className="flex items-start justify-between gap-4 py-4 text-sm">
                  <div>
                    <p className="font-medium text-stone-800">{selectedTrade.item}</p>
                    <p className="mt-1 text-xs text-stone-500">{selectedTrade.category}</p>
                  </div>
                  <p className={`shrink-0 font-medium tabular-nums ${selectedTrade.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>{selectedTrade.kind === 'Trade in' ? '+' : '−'}{currency.format(selectedTrade.amount)}</p>
                </div>
                <div className="flex items-baseline justify-between border-t border-emerald-200 pt-3">
                  <p className="text-sm font-semibold text-stone-800">{selectedTrade.kind === 'Trade in' ? 'Store credit issued' : 'Store credit redeemed'}</p>
                  <p className={`text-lg font-semibold tabular-nums ${selectedTrade.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>{selectedTrade.kind === 'Trade in' ? '+' : '−'}{currency.format(selectedTrade.amount)}</p>
                </div>
              </section>
  );
}
