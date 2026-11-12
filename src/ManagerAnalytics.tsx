import { useState } from 'react';
import { demoEnd, filterTrades, summarize, transactionDate, type Filters } from './analytics';
import { trades, type Trade } from './transactions';
import TransactionReceipt from './TransactionReceipt';

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const defaults: Filters = { start: '2026-11-04', end: demoEnd, store: '', employee: '', kind: '', category: '' };
const field = 'mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-emerald-700';
const panel = 'rounded-xl border border-emerald-200 bg-white p-5';

function Breakdown({ title, rows, onSelect }: { title: string; rows: { label: string; value: number; count: number }[]; onSelect: (label: string) => void }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return <section className={panel}><h2 className="font-semibold text-emerald-950">{title}</h2>
    <p className="mt-1 text-xs text-stone-500">Combined credit activity · select to filter</p>
    <div className="mt-4 space-y-4">{rows.map((row) => <button type="button" key={row.label} onClick={() => onSelect(row.label)} className="block w-full rounded text-left focus-visible:outline-2 focus-visible:outline-emerald-800">
      <span className="flex justify-between gap-3 text-sm"><span>{row.label} <span className="text-xs text-stone-500">({row.count})</span></span><strong>{money(row.value)}</strong></span>
      <span className="mt-2 block h-2 rounded bg-emerald-50"><span className="block h-full rounded bg-emerald-700" style={{ width: `${row.value / max * 100}%` }} /></span>
    </button>)}</div>
  </section>;
}

export default function ManagerAnalytics() {
  const [filters, setFilters] = useState<Filters>(defaults);
  const [selected, setSelected] = useState<Trade | null>(null);
  const invalid = !filters.start || !filters.end || filters.start > filters.end;
  const filtered = invalid ? [] : filterTrades(trades, filters);
  const summary = summarize(filtered);
  const set = (key: keyof Filters, value: string) => { setFilters((f) => ({ ...f, [key]: value })); setSelected(null); };
  const group = (key: 'category' | 'store' | 'employee') => [...new Set(filtered.map((t) => t[key]))].map((label) => {
    const rows = filtered.filter((t) => t[key] === label);
    return { label, count: rows.length, value: rows.reduce((sum, t) => sum + Math.round(t.amount * 100), 0) / 100 };
  }).sort((a, b) => b.value - a.value);
  const days = [...new Set(filtered.map(transactionDate))].sort().map((date) => ({ date, ...summarize(filtered.filter((t) => transactionDate(t) === date)) }));
  const maxDay = Math.max(...days.flatMap((d) => [d.issued, d.redeemed]), 1);
  return <main className="mx-auto max-w-6xl px-5 py-8 text-stone-900 sm:px-8">
    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Manager / Analytics</p>
    <h1 className="mt-2 text-3xl font-semibold text-emerald-950">Understand your trade activity</h1>
    <p className="mt-2 text-sm text-stone-600">Follow credit movement, spot busy categories, and open the receipt behind every transaction.</p>
    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">Demo data · November 4–12, 2026. Analytics and manager receipts share the same sample records. Live transaction storage is not connected.</p>
    <section aria-label="Analytics filters" className={`${panel} mt-5`}>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <label className="text-xs font-medium">From<input type="date" className={field} value={filters.start} onChange={(e) => set('start', e.target.value)} /></label>
        <label className="text-xs font-medium">Through<input type="date" className={field} value={filters.end} onChange={(e) => set('end', e.target.value)} /></label>
        {(['store', 'employee', 'kind', 'category'] as const).map((key) => <label key={key} className="text-xs font-medium">{({ store: 'Store', employee: 'Employee', kind: 'Trade type', category: 'Category' })[key]}
          <select className={field} value={filters[key]} onChange={(e) => set(key, e.target.value)}><option value="">All</option>
            {[...new Set(trades.map((t) => key === 'employee' ? t.employeeId : t[key]))].map((value) => <option key={value} value={value}>{key === 'employee' ? `${trades.find((t) => t.employeeId === value)?.employee} #${value}` : value}</option>)}
          </select></label>)}
      </div>
      <button type="button" className="mt-3 text-xs font-semibold text-emerald-800 underline" onClick={() => { setFilters(defaults); setSelected(null); }}>Reset filters</button>
      {invalid && <p role="alert" className="mt-2 text-sm text-red-700">Choose a valid date range with the start on or before the end.</p>}
    </section>
    <div aria-live="polite" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[
        ['Credit issued', money(summary.issued), 'Credit added through trade-ins'],
        ['Credit redeemed', money(summary.redeemed), 'Credit used through trade-outs'],
        ['Net credit change', money(summary.net), 'Issued − redeemed in this period'],
        ['Transactions', String(summary.count), 'Trade-ins and trade-outs'],
        ['Average transaction', money(summary.average), 'Combined credit activity ÷ transactions'],
        ['Customers served', String(summary.customers), 'Distinct customer names in sample records'],
      ].map(([label, value, detail]) => <section key={label} className={panel}><h2 className="text-xs font-medium text-stone-600">{label}</h2><p className="mt-2 text-2xl font-semibold text-emerald-950">{value}</p><p className="mt-1 text-xs text-stone-500">{detail}</p></section>)}
    </div>
    <p className="mt-3 text-xs text-stone-600">Net credit change is the movement during this period; an opening balance is needed to calculate outstanding credit. Credit activity does not measure sales or profit.</p>
    {!filtered.length ? <p role="status" className={`${panel} mt-5`}>No transactions match these filters. Adjust the date range or reset filters.</p> : <>
      <section className={`${panel} mt-5`} aria-label="Credit movement over time">
        <h2 className="font-semibold text-emerald-950">Credit movement over time</h2>
        <p className="mt-1 text-xs text-stone-500">Daily totals · green: issued · amber: redeemed. Dates without activity are omitted.</p>
        <div className="mt-5 space-y-3">{days.map((day) => <div key={day.date} className="grid items-center gap-3 sm:grid-cols-[100px_1fr]">
          <span className="text-xs text-stone-600">{day.date}</span><div className="space-y-1">
            {([['Issued', day.issued, 'bg-emerald-700'], ['Redeemed', day.redeemed, 'bg-amber-500']] as const).map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><div className="h-4 flex-1 rounded bg-stone-100"><div className={`h-full rounded ${color}`} style={{ width: `${value / maxDay * 100}%` }} /></div><span className="w-32 text-right text-xs">{label} {money(value)}</span></div>)}
          </div></div>)}</div>
      </section>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Breakdown title="Category mix" rows={group('category')} onSelect={(label) => set('category', label)} />
        <Breakdown title="Store activity" rows={group('store')} onSelect={(label) => set('store', label)} />
        <Breakdown title="Employee activity" rows={group('employee')} onSelect={(label) => set('employee', trades.find((t) => t.employee === label)?.employeeId || '')} />
      </div>
      <section className={`${panel} mt-5`}><h2 className="font-semibold text-emerald-950">Transactions behind the numbers</h2><p role="status" className="mt-1 text-xs text-stone-500">Showing {filtered.length} of {trades.length} transactions matching the filters above · select an ID to open its receipt</p>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[740px] text-left text-sm"><thead className="border-b border-emerald-200 text-xs text-stone-500"><tr>{['Transaction', 'Date', 'Customer', 'Category', 'Employee / Store', 'Credit'].map((h) => <th scope="col" className="p-2" key={h}>{h}</th>)}</tr></thead>
          <tbody>{[...filtered].sort((a, b) => transactionDate(b).localeCompare(transactionDate(a)) || b.id.localeCompare(a.id)).map((t) => <tr key={t.id} className="border-b border-emerald-50"><td className="p-2"><button type="button" aria-label={`View receipt for transaction ${t.id}`} className="font-semibold text-emerald-800 underline" onClick={() => setSelected(t)}>{t.id}</button><p className="text-xs text-stone-500">{t.kind}</p></td><td className="p-2">{transactionDate(t)}</td><td className="p-2">{t.account}</td><td className="p-2">{t.category}</td><td className="p-2">{t.employee}<p className="text-xs text-stone-500">{t.store}</p></td><td className={`p-2 whitespace-nowrap font-medium tabular-nums ${t.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>{t.kind === 'Trade in' ? '+' : '−'}{money(t.amount)}</td></tr>)}</tbody>
        </table></div>
        {selected && <div ref={(node) => { if (node) node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}><TransactionReceipt selectedTrade={selected} onClose={() => setSelected(null)} /></div>}
      </section>
    </>}
  </main>;
}
