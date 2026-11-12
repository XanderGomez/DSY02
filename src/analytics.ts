import type { Trade } from './transactions';

// Fixed demo window: dates stay reproducible and do not imply live activity.
export const demoEnd = '2026-11-12';
const dayDates: Record<Trade['day'], string> = {
  Today: demoEnd, Yesterday: '2026-11-11', Monday: '2026-11-09', Tuesday: '2026-11-10',
  Wednesday: '2026-11-04', Thursday: '2026-11-05', Friday: '2026-11-06', Saturday: '2026-11-07',
};
export const transactionDate = (trade: Trade) => dayDates[trade.day];
export type Filters = { start: string; end: string; store: string; employee: string; kind: string; category: string };
export function filterTrades(trades: Trade[], filters: Filters): Trade[] {
  return trades.filter((trade) => transactionDate(trade) >= filters.start && transactionDate(trade) <= filters.end
    && (!filters.store || trade.store === filters.store)
    && (!filters.employee || trade.employeeId === filters.employee)
    && (!filters.kind || trade.kind === filters.kind)
    && (!filters.category || trade.category === filters.category));
}
export function summarize(trades: Trade[]) {
  // Work in cents so ledger totals do not accumulate floating-point rounding errors.
  const total = (kind: Trade['kind']) => trades.filter((t) => t.kind === kind).reduce((sum, t) => sum + Math.round(t.amount * 100), 0) / 100;
  const issued = total('Trade in');
  const redeemed = total('Trade out');
  const count = trades.length;
  return { issued, redeemed, net: issued - redeemed, count,
    average: count ? (issued + redeemed) / count : 0,
    customers: new Set(trades.map((t) => t.account)).size };
}
