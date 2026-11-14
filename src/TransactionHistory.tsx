import { useState } from 'react';
import { searchTransactions, trades, type Trade } from './transactions';
import { transactionDate } from './analytics';
import TransactionReceipt from './TransactionReceipt';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function TransactionHistory() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Trade | null>(null);
  const matching = searchTransactions(trades, query);
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Manager / History</p>
      <h1 className="mt-2 text-3xl font-semibold text-emerald-950">Transaction history</h1>
      <p className="mt-2 text-sm text-stone-600">Browse all trade-ins and trade-outs, or find a transaction using the number from the POS receipt.</p>
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Sample history with demo POS numbers (for example, 102841). Trade forms currently check details only; new entries are not saved to this history yet.</p>
      <section aria-label="Search transaction history" className="mt-5 rounded-xl border border-emerald-200 bg-white p-5">
        <label className="block text-sm font-medium text-emerald-950" htmlFor="history-pos-search">POS transaction number</label>
        <div className="mt-2 flex gap-3">
          <input id="history-pos-search" type="search" maxLength={200} className="min-w-0 flex-1 rounded-lg border border-emerald-200 px-3 py-3 text-sm focus:outline-emerald-800" placeholder="Enter all or part of a POS number" value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} aria-describedby="history-search-help" />
          <button type="button" onClick={() => { setQuery(''); setSelected(null); }} className="rounded-lg border border-emerald-200 px-4 text-sm font-medium text-emerald-800 hover:bg-emerald-50">Clear</button>
        </div>
        <p id="history-search-help" className="mt-2 text-xs text-stone-500">Results update as you type. Select a transaction to view its receipt.</p>
        <p role="status" className="mt-4 text-sm text-stone-600">{matching.length} of {trades.length} transactions</p>
        {matching.length ? <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-emerald-200 text-xs text-stone-500"><tr>{['Transaction / POS number', 'Date', 'Type', 'Customer', 'Employee / Store', 'Credit'].map((label) => <th scope="col" key={label} className="p-3">{label}</th>)}</tr></thead>
          <tbody>{matching.map((trade) => <tr key={trade.id} className="border-b border-emerald-100 hover:bg-emerald-50">
            <td className="p-3"><button type="button" className="font-semibold text-emerald-800 underline focus-visible:outline-2" aria-label={`View receipt for transaction ${trade.id}`} onClick={() => setSelected(trade)}>{trade.id}</button><p className="mt-1 break-all text-xs text-stone-600">POS: {trade.posTransactionId || 'Not recorded'}</p></td>
            <td className="p-3">{transactionDate(trade)}</td><td className="p-3">{trade.kind}</td><td className="p-3">{trade.account}</td>
            <td className="p-3">{trade.employee}<p className="text-xs text-stone-500">{trade.store}</p></td>
            <td className={`whitespace-nowrap p-3 font-medium ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>{trade.kind === 'Trade in' ? '+' : '−'}{currency.format(trade.amount)}</td>
          </tr>)}</tbody>
        </table></div> : <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-stone-700">No transactions match this POS number. Check the number or clear the search to see all transactions.</p>}
        {selected && <TransactionReceipt selectedTrade={selected} onClose={() => setSelected(null)} />}
      </section>
    </main>
  );
}
