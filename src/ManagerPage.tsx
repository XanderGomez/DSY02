import { useState, type FormEvent } from 'react';

export type Trade = {
  id: string;
  kind: 'Trade in' | 'Trade out';
  account: string;
  employee: string;
  employeeId: string;
  store: string;
  item: string;
  category: string;
  amount: number;
  time: string;
  day: 'Today' | 'Yesterday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
};

export const trades: Trade[] = [
  { id: 'TR-2841', kind: 'Trade in', account: 'Maya Thompson', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'The Legend of Zelda: Breath of the Wild', category: 'Video games', amount: 42.5, time: '10:42 AM', day: 'Today' },
  { id: 'TR-2840', kind: 'Trade out', account: 'Liam Carter', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Dungeons & Dragons Player’s Handbook', category: 'Books', amount: 28, time: '10:18 AM', day: 'Today' },
  { id: 'TR-2839', kind: 'Trade in', account: 'Elena Garcia', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Magic: The Gathering card collection', category: 'Trading cards', amount: 65, time: '9:56 AM', day: 'Today' },
  { id: 'TR-2838', kind: 'Trade in', account: 'Oliver Reed', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Catan board game', category: 'Board games', amount: 18.75, time: '9:21 AM', day: 'Today' },
  { id: 'TR-2837', kind: 'Trade out', account: 'Sofia Patel', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Warhammer miniature set', category: 'Miniatures', amount: 35, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2836', kind: 'Trade in', account: 'Ethan Brooks', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Pokémon card collection', category: 'Trading cards', amount: 53.25, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2835', kind: 'Trade in', account: 'Nora Wilson', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Ticket to Ride board game', category: 'Board games', amount: 31, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2834', kind: 'Trade in', account: 'Theo Martin', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Nintendo Switch game bundle', category: 'Video games', amount: 24, time: 'Monday', day: 'Monday' },
  { id: 'TR-2833', kind: 'Trade out', account: 'Avery Scott', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Pathfinder core rulebook', category: 'Books', amount: 19.5, time: 'Monday', day: 'Monday' },
  { id: 'TR-2832', kind: 'Trade in', account: 'Isabel Moore', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Yu-Gi-Oh! card collection', category: 'Trading cards', amount: 46, time: 'Tuesday', day: 'Tuesday' },
  { id: 'TR-2831', kind: 'Trade in', account: 'Caleb Young', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Xbox game bundle', category: 'Video games', amount: 37.5, time: 'Wednesday', day: 'Wednesday' },
  { id: 'TR-2830', kind: 'Trade in', account: 'Zoe Adams', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Carcassonne board game', category: 'Board games', amount: 29, time: 'Thursday', day: 'Thursday' },
  { id: 'TR-2829', kind: 'Trade in', account: 'Milo Baker', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Dragonlance novel collection', category: 'Books', amount: 58, time: 'Friday', day: 'Friday' },
  { id: 'TR-2828', kind: 'Trade out', account: 'Ruby Evans', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Pokémon Elite Trainer Box', category: 'Trading cards', amount: 22, time: 'Saturday', day: 'Saturday' },
];

// Relative labels keep the fixture independent of the real calendar date.
// Saturday and Yesterday represent the same day in this sample week.
export const activityDays: { label: string; days: Trade['day'][] }[] = [
  { label: '6 days ago', days: ['Monday'] },
  { label: '5 days ago', days: ['Tuesday'] },
  { label: '4 days ago', days: ['Wednesday'] },
  { label: '3 days ago', days: ['Thursday'] },
  { label: '2 days ago', days: ['Friday'] },
  { label: 'Yesterday', days: ['Saturday', 'Yesterday'] },
  { label: 'Today', days: ['Today'] },
];

export type Period = 'Today' | 'Last 7 days';

export function getPeriodTrades(period: Period, activity: Trade[] = trades) {
  return period === 'Today' ? activity.filter(({ day }) => day === 'Today') : activity;
}

export function summarizeTrades(activity: Trade[]) {
  const issuedCents = activity.filter(({ kind }) => kind === 'Trade in')
    .reduce((sum, { amount }) => sum + Math.round(amount * 100), 0);
  const redeemedCents = activity.filter(({ kind }) => kind === 'Trade out')
    .reduce((sum, { amount }) => sum + Math.round(amount * 100), 0);
  const tradeIns = activity.filter(({ kind }) => kind === 'Trade in').length;
  return {
    issued: issuedCents / 100,
    redeemed: redeemedCents / 100,
    net: (issuedCents - redeemedCents) / 100,
    count: activity.length,
    tradeIns,
    tradeOuts: activity.length - tradeIns,
    averageIssued: tradeIns ? issuedCents / 100 / tradeIns : 0,
  };
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const panel = 'min-w-0 rounded-2xl border border-emerald-200 bg-[#f8fbf6] p-5 sm:p-6';

function StatCard({ label, amount, detail, primary = false }: {
  label: string;
  amount: string;
  detail: string;
  primary?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-xl border p-5 sm:p-6 ${primary ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-emerald-200 bg-[#f8fbf6] text-emerald-950'}`}>
      <dt className={`text-sm font-medium ${primary ? 'text-emerald-100' : 'text-stone-600'}`}>{label}</dt>
      <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums lg:text-4xl">{amount}</dd>
      <dd className={`mt-3 text-xs leading-5 ${primary ? 'text-emerald-100' : 'text-stone-600'}`}>{detail}</dd>
    </div>
  );
}

function ManagerPage() {
  const [period, setPeriod] = useState<Period>('Today');
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const periodTrades = getPeriodTrades(period);
  const summary = summarizeTrades(periodTrades);
  const dailyTotals = activityDays
    .filter(({ label }) => period !== 'Today' || label === 'Today')
    .map(({ label, days }) => ({
      label,
      ...summarizeTrades(periodTrades.filter(({ day }) => days.includes(day))),
    }));
  const highestDailyTotal = Math.max(...dailyTotals.flatMap(({ issued, redeemed }) => [issued, redeemed]), 1);
  const storeTotals = [...new Set(trades.map(({ store }) => store))]
    .map((store) => ({ store, ...summarizeTrades(periodTrades.filter((trade) => trade.store === store)) }))
    .sort((a, b) => b.issued - a.issued);
  const employee = trades.find((trade) => trade.employeeId === employeeId);
  const employeeTrades = periodTrades.filter((trade) => trade.employeeId === employeeId);
  const employeeSummary = summarizeTrades(employeeTrades);
  const recentTrades = periodTrades.slice(0, 5);

  function searchEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmployeeId(employeeIdInput.trim());
  }

  return (
    <main className="bg-[#e6f0e5] text-stone-900">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Manager overview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">Trade activity</h1>
            <p className="mt-2 text-sm text-stone-600">Credit movement, store performance, and team activity.</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-stone-600">Reporting period</p>
            <div aria-label="Reporting period" className="inline-flex rounded-lg border border-emerald-200 bg-[#f8fbf6] p-1" role="group">
              {(['Today', 'Last 7 days'] as const).map((option) => (
                <button
                  aria-pressed={period === option}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${period === option ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-600 hover:bg-emerald-100 hover:text-emerald-950'}`}
                  key={option}
                  onClick={() => { setPeriod(option); setSelectedTrade(null); }}
                  type="button"
                >{option}</button>
              ))}
            </div>
          </div>
        </div>

        <section aria-labelledby="summary-title" className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-emerald-950" id="summary-title">{period} at a glance</h2>
            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-900">Sample data · All stores</span>
          </div>
          <dl aria-live="polite" aria-atomic="true" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Credit issued" amount={currency.format(summary.issued)} detail={`${summary.tradeIns} trade-ins · Added to customer credit`} primary />
            <StatCard label="Credit redeemed" amount={currency.format(summary.redeemed)} detail={`${summary.tradeOuts} trade-outs · Used on purchases`} />
            <StatCard label="Net credit change" amount={`${summary.net > 0 ? '+' : ''}${currency.format(summary.net)}`} detail="Credit issued minus credit redeemed" />
            <StatCard label="Transactions" amount={String(summary.count)} detail={`${currency.format(summary.averageIssued)} average credit per trade-in`} />
          </dl>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <section aria-labelledby="trend-title" className={panel}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-emerald-950" id="trend-title">Credit movement</h2>
                <p className="mt-1 text-xs text-stone-600">{period} · Credit issued and redeemed by day</p>
              </div>
              <div className="flex gap-4 text-xs text-stone-600">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-700" />Issued</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-500" />Redeemed</span>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-lg bg-emerald-50/60 px-3 pt-5" tabIndex={0} role="region" aria-label="Daily credit chart; scroll horizontally on smaller screens">
              <div className={`flex gap-3 ${dailyTotals.length > 1 ? 'min-w-[480px]' : ''}`}>
                {dailyTotals.map(({ label, issued, redeemed }) => (
                  <div key={label} className="min-w-0 flex-1">
                    <div aria-hidden="true" className="flex h-40 items-end justify-center gap-1.5 border-b border-emerald-200">
                      <div title={`Issued: ${currency.format(issued)}`} className="w-6 rounded-t bg-emerald-700" style={{ height: `${issued / highestDailyTotal * 100}%` }} />
                      <div title={`Redeemed: ${currency.format(redeemed)}`} className="w-6 rounded-t bg-amber-500" style={{ height: `${redeemed / highestDailyTotal * 100}%` }} />
                    </div>
                    <dl className="py-3 text-center text-xs tabular-nums">
                      <dt className="mb-2 font-medium text-stone-600">{label}</dt>
                      <dd className="font-semibold text-emerald-800"><span className="sr-only">Issued: </span>{currency.format(issued)}</dd>
                      <dd className="mt-1 text-amber-800"><span className="sr-only">Redeemed: </span>{currency.format(redeemed)}</dd>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="stores-title" className={panel}>
            <h2 className="text-base font-semibold text-emerald-950" id="stores-title">By store</h2>
            <p className="mt-1 text-xs text-stone-600">{period} · Share of credit issued</p>
            <ul className="mt-6 space-y-6">
              {storeTotals.map(({ store, issued, redeemed, count }) => {
                const share = summary.issued ? issued / summary.issued * 100 : 0;
                return (
                  <li key={store}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-stone-800">{store}</span>
                      <span className="font-semibold text-emerald-950 tabular-nums">{currency.format(issued)} <span className="ml-1 text-xs font-normal text-stone-500">{Math.round(share)}%</span></span>
                    </div>
                    <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                      <div className="h-full rounded-full bg-emerald-700" style={{ width: `${share}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-stone-600">{count} transactions · {currency.format(redeemed)} redeemed</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <section aria-labelledby="transactions-title" className={panel}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold text-emerald-950" id="transactions-title">Recent transactions</h2>
              <span className="text-xs text-stone-600">{period} · Showing {recentTrades.length} of {summary.count}</span>
            </div>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Recent transactions table">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="sr-only">Latest transactions for {period.toLowerCase()}, across all stores</caption>
                <thead>
                  <tr className="border-y border-emerald-200 bg-emerald-50 text-xs text-stone-600">
                    <th scope="col" className="px-3 py-3 font-medium">Transaction</th>
                    <th scope="col" className="px-3 py-3 font-medium">Customer</th>
                    <th scope="col" className="px-3 py-3 font-medium">Employee / Store</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Credit</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {recentTrades.map((trade) => (
                    <tr className="cursor-pointer hover:bg-emerald-50" key={trade.id} onClick={() => setSelectedTrade(trade)}>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${trade.kind === 'Trade in' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{trade.kind}</span>
                        <button
                          aria-label={`View receipt for transaction ${trade.id}`}
                          aria-expanded={selectedTrade?.id === trade.id}
                          aria-controls={selectedTrade?.id === trade.id ? 'transaction-receipt' : undefined}
                          className="mt-1 block rounded text-xs font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                          onClick={() => setSelectedTrade(trade)}
                          type="button"
                        >{trade.id}</button>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-stone-800">{trade.account}</td>
                      <td className="px-3 py-3.5 text-stone-700">{trade.employee}<span className="mt-1 block text-xs text-stone-500">#{trade.employeeId} · {trade.store}</span></td>
                      <td className={`whitespace-nowrap px-3 py-3.5 text-right font-semibold tabular-nums ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-amber-800'}`}>{trade.kind === 'Trade in' ? '+' : '−'}{currency.format(trade.amount)}</td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-right text-xs text-stone-600">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedTrade && (
              <section id="transaction-receipt" aria-labelledby="transaction-receipt-title" className="mx-auto mt-5 max-w-xl rounded-lg border border-emerald-200 bg-white p-5 shadow-sm" aria-live="polite">
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-emerald-200 pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Transaction receipt</p>
                    <h3 className="mt-1 text-lg font-semibold text-emerald-950" id="transaction-receipt-title">{selectedTrade.id}</h3>
                    <p className="mt-1 text-xs text-stone-500">{selectedTrade.day === selectedTrade.time ? selectedTrade.day : `${selectedTrade.day} · ${selectedTrade.time}`}</p>
                  </div>
                  <button
                    aria-label="Close transaction receipt"
                    className="rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-800"
                    onClick={() => setSelectedTrade(null)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-dashed border-emerald-200 py-4 text-sm">
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
                  <p className="shrink-0 font-medium text-stone-800">{currency.format(selectedTrade.amount)}</p>
                </div>
                <div className="flex items-baseline justify-between border-t border-emerald-200 pt-3">
                  <p className="text-sm font-semibold text-stone-800">{selectedTrade.kind === 'Trade in' ? 'Store credit issued' : 'Store credit redeemed'}</p>
                  <p className="text-lg font-semibold text-emerald-950">{currency.format(selectedTrade.amount)}</p>
                </div>
              </section>
            )}
          </section>

          <section aria-labelledby="employee-title" className={panel}>
            <h2 className="text-base font-semibold text-emerald-950" id="employee-title">Employee activity</h2>
            <p className="mt-1 text-xs text-stone-600">View an employee&apos;s totals for {period.toLowerCase()}.</p>
            <form className="mt-5" onSubmit={searchEmployee}>
              <label className="text-xs font-medium text-stone-700" htmlFor="employee-id">Employee ID</label>
              <div className="mt-2 flex gap-2">
                <input
                  aria-describedby="employee-hint"
                  className="h-10 min-w-0 flex-1 rounded-md border border-emerald-200 bg-white px-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  id="employee-id"
                  inputMode="numeric"
                  onChange={(event) => setEmployeeIdInput(event.target.value)}
                  placeholder="e.g. 1042"
                  value={employeeIdInput}
                />
                <button className="rounded-md bg-emerald-800 px-4 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800" type="submit">View</button>
              </div>
              <p className="mt-2 text-xs text-stone-500" id="employee-hint">Sample IDs: 1042, 1087, 1124</p>
            </form>
            <div aria-live="polite" aria-atomic="true" className="mt-5 border-t border-emerald-200 pt-4">
              {employeeId ? employee ? (
                <>
                  <p className="text-sm font-semibold text-emerald-950">{employee.employee}</p>
                  <p className="mt-1 text-xs text-stone-600">#{employeeId} · {employeeSummary.count} transactions · {period}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3">
                    <div><dt className="text-xs text-stone-600">Credit issued</dt><dd className="mt-1 text-xl font-semibold text-emerald-800 tabular-nums">{currency.format(employeeSummary.issued)}</dd></div>
                    <div><dt className="text-xs text-stone-600">Redeemed</dt><dd className="mt-1 text-xl font-semibold text-amber-800 tabular-nums">{currency.format(employeeSummary.redeemed)}</dd></div>
                  </dl>
                  {employeeTrades.length > 0 ? (
                    <ul aria-label="Employee transactions" className="mt-4 max-h-52 divide-y divide-emerald-100 overflow-y-auto">
                      {employeeTrades.map((trade) => (
                        <li className="flex items-center justify-between gap-3 py-3 text-xs" key={trade.id}>
                          <span className="min-w-0">
                            <span className="block font-medium text-stone-800">{trade.account}</span>
                            <span className="mt-1 block text-stone-600">{trade.kind} · {trade.store}</span>
                          </span>
                          <span className={`shrink-0 font-semibold tabular-nums ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-amber-800'}`}>{trade.kind === 'Trade in' ? '+' : '−'}{currency.format(trade.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="mt-4 text-sm text-stone-600">No transactions in this period.</p>}
                </>
              ) : <p className="text-sm text-stone-600">No employee found for ID {employeeId}.</p>
                : <p className="text-sm leading-6 text-stone-600">Enter an ID to see credit issued, credit redeemed, and transaction count.</p>}
            </div>
          </section>
        </div>
        <p className="mt-5 text-xs leading-5 text-stone-600">Demonstration data only. Net credit change describes activity in the selected period, not the total outstanding customer balance.</p>
      </div>
    </main>
  );
}

export default ManagerPage;
