import { useMemo, useState } from 'react';

type Trade = {
  id: string;
  kind: 'Trade in' | 'Trade out';
  account: string;
  employee: string;
  employeeId: string;
  store: string;
  amount: number;
  time: string;
  day: 'Today' | 'Yesterday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
};

const trades: Trade[] = [
  { id: 'TR-2841', kind: 'Trade in', account: 'Maya Thompson', employee: 'Jordan Davis', employeeId: '1042', store: 'Downtown', amount: 42.5, time: '10:42 AM', day: 'Today' },
  { id: 'TR-2840', kind: 'Trade out', account: 'Liam Carter', employee: 'Alex Kim', employeeId: '1087', store: 'Westside', amount: 28, time: '10:18 AM', day: 'Today' },
  { id: 'TR-2839', kind: 'Trade in', account: 'Elena Garcia', employee: 'Jordan Davis', employeeId: '1042', store: 'Downtown', amount: 65, time: '9:56 AM', day: 'Today' },
  { id: 'TR-2838', kind: 'Trade in', account: 'Oliver Reed', employee: 'Morgan Lee', employeeId: '1124', store: 'Eastside', amount: 18.75, time: '9:21 AM', day: 'Today' },
  { id: 'TR-2837', kind: 'Trade out', account: 'Sofia Patel', employee: 'Alex Kim', employeeId: '1087', store: 'Westside', amount: 35, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2836', kind: 'Trade in', account: 'Ethan Brooks', employee: 'Jordan Davis', employeeId: '1042', store: 'Downtown', amount: 53.25, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2835', kind: 'Trade in', account: 'Nora Wilson', employee: 'Morgan Lee', employeeId: '1124', store: 'Eastside', amount: 31, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2834', kind: 'Trade in', account: 'Theo Martin', employee: 'Alex Kim', employeeId: '1087', store: 'Westside', amount: 24, time: 'Monday', day: 'Monday' },
  { id: 'TR-2833', kind: 'Trade out', account: 'Avery Scott', employee: 'Morgan Lee', employeeId: '1124', store: 'Eastside', amount: 19.5, time: 'Monday', day: 'Monday' },
  { id: 'TR-2832', kind: 'Trade in', account: 'Isabel Moore', employee: 'Jordan Davis', employeeId: '1042', store: 'Downtown', amount: 46, time: 'Tuesday', day: 'Tuesday' },
  { id: 'TR-2831', kind: 'Trade in', account: 'Caleb Young', employee: 'Alex Kim', employeeId: '1087', store: 'Westside', amount: 37.5, time: 'Wednesday', day: 'Wednesday' },
  { id: 'TR-2830', kind: 'Trade in', account: 'Zoe Adams', employee: 'Morgan Lee', employeeId: '1124', store: 'Eastside', amount: 29, time: 'Thursday', day: 'Thursday' },
  { id: 'TR-2829', kind: 'Trade in', account: 'Milo Baker', employee: 'Jordan Davis', employeeId: '1042', store: 'Downtown', amount: 58, time: 'Friday', day: 'Friday' },
  { id: 'TR-2828', kind: 'Trade out', account: 'Ruby Evans', employee: 'Alex Kim', employeeId: '1087', store: 'Westside', amount: 22, time: 'Saturday', day: 'Saturday' },
];

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

function ManagerPage({ onBackToSearch }: { onBackToSearch?: () => void }) {
  const [period, setPeriod] = useState<'Today' | 'This week'>('Today');
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [employeeId, setEmployeeId] = useState('');

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

  const employeeTradeIns = useMemo(
    () => employeeId
      ? trades.filter((trade) => trade.employeeId === employeeId && trade.kind === 'Trade in')
      : [],
    [employeeId],
  );
  const employeeName = employeeTradeIns[0]?.employee;
  const employeeTotal = employeeTradeIns.reduce((total, trade) => total + trade.amount, 0);

  function searchEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmployeeId(employeeIdInput.trim());
  }

  return (
    <main className="min-h-screen bg-[#e6f0e5] text-stone-900">
      <header className="flex h-16 items-center justify-between border-b border-emerald-950 bg-emerald-950 px-5 text-white sm:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />
          Dragon&apos;s Lair
        </span>
        {onBackToSearch ? <button type="button" onClick={onBackToSearch} className="rounded-md px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-lime-300">Back to search</button> : <span className="text-xs font-medium text-emerald-100">Manager</span>}
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="mt-8 rounded-xl border border-emerald-200 bg-[#f3f8f1] px-4 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Manager</p>
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

          <section className="mt-4 grid gap-5 min-[600px]:grid-cols-[1.1fr_0.9fr]">
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

            <article className="min-w-0 border-t border-emerald-200 pt-3 min-[600px]:border-l min-[600px]:border-t-0 min-[600px]:pl-5 min-[600px]:pt-0">
              <div>
                <h2 className="text-sm font-semibold text-emerald-950">Employee activity</h2>
                <p className="mt-0.5 text-[11px] text-stone-500">Find trade-ins by employee ID</p>
              </div>
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
              </form>
              {employeeId && (
                <div aria-live="polite" className="mt-3 border-t border-emerald-200 pt-2">
                  {employeeTradeIns.length ? (
                    <>
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{employeeName}</p>
                          <p className="text-[10px] text-stone-500">ID {employeeId}</p>
                        </div>
                        <p className="text-xs font-semibold text-emerald-800">{currency.format(employeeTotal)}</p>
                      </div>
                      <ul className="mt-1 max-h-24 divide-y divide-emerald-100 overflow-y-auto">
                        {employeeTradeIns.map((trade) => (
                          <li className="flex items-center justify-between gap-3 py-1 text-[11px]" key={trade.id}>
                            <span className="min-w-0 truncate text-stone-700">{trade.account} <span className="text-stone-400">· {trade.store}</span></span>
                            <span className="shrink-0 font-medium text-emerald-800">{currency.format(trade.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-xs text-stone-600">No trade-ins found for employee ID {employeeId}.</p>
                  )}
                </div>
              )}
            </article>
          </section>

          <section className="mt-4 border-t border-emerald-200 pt-3">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold text-emerald-950">Recent transactions</h2>
              <span className="text-[11px] text-stone-500">Latest 5</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-emerald-200 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                    <th className="py-2 pr-3">Type</th>
                    <th className="px-3 py-2">Account</th>
                    <th className="px-3 py-2">Employee</th>
                    <th className="px-3 py-2">Store</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="py-2 pl-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {trades.slice(0, 5).map((trade) => (
                    <tr className="text-xs hover:bg-emerald-50/60" key={trade.id}>
                      <td className="py-2 pr-3">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${trade.kind === 'Trade in' ? 'text-emerald-800' : 'text-amber-800'}`}>
                          <span className={`size-1.5 rounded-full ${trade.kind === 'Trade in' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          {trade.kind}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-medium text-stone-800">{trade.account}</td>
                      <td className="px-3 py-2 text-stone-600">
                        {trade.employee}<span className="ml-1 text-[10px] text-stone-400">#{trade.employeeId}</span>
                      </td>
                      <td className="px-3 py-2 text-stone-600">{trade.store}</td>
                      <td className="px-3 py-2 font-medium text-stone-800">{currency.format(trade.amount)}</td>
                      <td className="py-2 pl-3 text-stone-500">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ManagerPage;
