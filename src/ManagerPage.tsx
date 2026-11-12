import { useState } from 'react';

import { trades, type Trade } from './transactions';
import TransactionReceipt from './TransactionReceipt';

const weekDays: Trade['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today'];
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function StatCard({
  label,
  amount,
  detail,
}: {
  label: string;
  amount: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 border-l border-emerald-200 px-3 first:border-l-0 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <p className="text-[11px] font-medium text-stone-600 sm:text-xs">{label}</p>
        <p className="text-base font-semibold tracking-tight text-emerald-950 sm:text-lg">{amount}</p>
      </div>
      <p className="mt-0.5 text-[10px] text-stone-500 sm:text-[11px]">{detail}</p>
    </div>
  );
}

function ManagerPage() {
  const [period, setPeriod] = useState<'Today' | 'This week'>('Today');
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const todayTradeIns = trades.filter((trade) => trade.kind === 'Trade in' && trade.day === 'Today');
  const weeklyTradeIns = trades.filter((trade) => trade.kind === 'Trade in');
  const periodTradeIns = period === 'Today' ? todayTradeIns : weeklyTradeIns;
  const periodTotal = periodTradeIns.reduce((total, trade) => total + trade.amount, 0);
  const periodTitle = period === 'Today' ? 'Today' : 'This week';

  const dailyTotals = weekDays.map((day) => ({
    day: day === 'Today' ? 'Today' : day.slice(0, 3),
    total: trades
      .filter((trade) => trade.kind === 'Trade in' && trade.day === day)
      .reduce((sum, trade) => sum + trade.amount, 0),
  }));
  const highestDailyTotal = Math.max(...dailyTotals.map(({ total }) => total), 1);

  const employeeTransactions = employeeId ? trades.filter((trade) => trade.employeeId === employeeId) : [];
  const visibleTransactions = employeeId ? employeeTransactions : trades.slice(0, 5);
  const employeeName = employeeTransactions[0]?.employee;

  function searchEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmployeeId(employeeIdInput.trim());
    setSelectedTrade(null);
  }

  return (
    <main className="bg-[#e6f0e5] text-stone-900">

      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="mt-8 rounded-xl border border-emerald-200 bg-[#f3f8f1] px-4 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Manager</p>
              <a href="#/manager/analytics" className="float-right rounded-lg bg-emerald-800 px-4 py-2 text-sm text-white">Explore analytics →</a>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-emerald-950 sm:text-2xl">Trade activity</h1>
              <p className="mt-1 text-xs text-stone-500">Sample activity for demonstration.</p>
            </div>
            <div aria-label="Summary period" className="inline-flex self-start rounded-lg border border-emerald-200 bg-white p-1 sm:self-auto" role="group">
              {(['Today', 'This week'] as const).map((option) => (
                <button
                  aria-pressed={period === option}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${period === option ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-950'}`}
                  key={option}
                  onClick={() => setPeriod(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <section aria-label={`${periodTitle} trade-in summary`} className="mt-4 grid grid-cols-3 border-y border-emerald-200 bg-emerald-50/70 py-2">
            <StatCard
              amount={currency.format(periodTotal)}
              detail={`${periodTradeIns.length} trade-ins`}
              label={`${periodTitle} total`}
            />
            <StatCard
              amount={String(periodTradeIns.length)}
              detail="Across all stores"
              label="Transactions"
            />
            <StatCard
              amount={currency.format(periodTradeIns.length ? periodTotal / periodTradeIns.length : 0)}
              detail="Per trade-in"
              label="Average credit"
            />
          </section>

          <section className="mt-4">
            <article className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-emerald-950">Trade-ins by day</h2>
                  <p className="mt-0.5 text-[11px] text-stone-500">Last seven days</p>
                </div>
                <span className="text-xs font-medium text-emerald-800">
                  {currency.format(weeklyTradeIns.reduce((total, trade) => total + trade.amount, 0))}
                </span>
              </div>
              <div className="mt-2 flex h-20 items-end justify-between gap-2 border-b border-emerald-200 px-1">
                {dailyTotals.map(({ day, total }) => (
                  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" key={day}>
                    <span className="text-[9px] text-stone-500">{total ? currency.format(total) : ''}</span>
                    <div
                      aria-label={`${day}: ${currency.format(total)} in trade-ins`}
                      className={`w-full max-w-12 rounded-t-md ${day === 'Today' ? 'bg-emerald-700' : 'bg-emerald-300'}`}
                      role="img"
                      style={{ height: `${Math.max((total / highestDailyTotal) * 65, 4)}%` }}
                    />
                    <span className="pb-1 text-[9px] text-stone-500">{day}</span>
                  </div>
                ))}
              </div>
            </article>


          </section>

          <section aria-labelledby="employee-search-title" className="mt-4 rounded-lg border border-emerald-200 bg-white p-4">
            <h2 id="employee-search-title" className="text-sm font-semibold text-emerald-950">Search transactions by employee</h2>
            <p className="mt-1 text-xs text-stone-500">Enter an employee ID to filter the transactions below.</p>
              <form className="mt-2 flex gap-2" onSubmit={searchEmployee}>
                <label className="sr-only" htmlFor="employee-id">Employee ID</label>
                <input
                  className="h-9 min-w-0 flex-1 rounded-md border border-emerald-200 bg-white px-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  id="employee-id"
                  inputMode="numeric"
                  onChange={(event) => setEmployeeIdInput(event.target.value)}
                  placeholder="Employee ID"
                  value={employeeIdInput}
                />
                <button
                  className="rounded-md bg-emerald-800 px-3 text-xs font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                  type="submit"
                >
                  View
                </button>
                <button
                  className="rounded-md border border-emerald-200 px-3 text-xs font-medium text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                  type="button"
                  onClick={() => { setEmployeeIdInput(''); setEmployeeId(''); setSelectedTrade(null); }}
                >
                  Clear
                </button>
              </form>
          </section>

          <section className="mt-4 border-t border-emerald-200 pt-3">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold text-emerald-950">{employeeId ? `Transactions for ${employeeName || 'employee'} · #${employeeId}` : 'Recent transactions'}</h2>
              <span aria-live="polite" className="text-[11px] text-stone-500">{employeeId ? `${visibleTransactions.length} transactions` : 'Latest 5'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-emerald-200 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                    <th className="py-2 pr-3">Transaction</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Employee</th>
                    <th className="px-3 py-2">Store</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Credit</th>
                    <th className="py-2 pl-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {employeeId && !visibleTransactions.length && (
                    <tr><td colSpan={7} className="py-5 text-center text-sm text-stone-600">No transactions found for employee ID {employeeId}.</td></tr>
                  )}
                  {visibleTransactions.map((trade) => (
                    <tr className="cursor-pointer text-xs hover:bg-emerald-50/60" key={trade.id} onClick={() => setSelectedTrade(trade)}>
                      <td className="py-2 pr-3">
                        <button
                          aria-label={`View receipt for transaction ${trade.id}`}
                          className="rounded px-1 py-1 text-left font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-emerald-800"
                          onClick={() => setSelectedTrade(trade)}
                          type="button"
                        >
                          {trade.id}
                        </button>
                        <span className={`ml-2 inline-flex items-center gap-1.5 font-medium ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>
                          <span className={`size-1.5 rounded-full ${trade.kind === 'Trade in' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {trade.kind}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-medium text-stone-800">{trade.account}</td>
                      <td className="px-3 py-2 text-stone-600">
                        {trade.employee}<span className="ml-1 text-[10px] text-stone-400">#{trade.employeeId}</span>
                      </td>
                      <td className="px-3 py-2 text-stone-600">{trade.store}</td>
                      <td className="px-3 py-2 text-stone-600">{trade.category}</td>
                      <td className={`px-3 py-2 font-medium tabular-nums ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-red-700'}`}>{trade.kind === 'Trade in' ? '+' : '−'}{currency.format(trade.amount)}</td>
                      <td className="py-2 pl-3 text-stone-500">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedTrade && (
              <TransactionReceipt selectedTrade={selectedTrade} onClose={() => setSelectedTrade(null)} />
            )}
          </section>
          <div className="mt-5 flex justify-center border-t border-emerald-200 pt-5">
            <a href="#/manager/history" className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">View all transaction history →</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ManagerPage;
