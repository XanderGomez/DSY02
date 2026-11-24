import type { Trade } from '../transactions/transactions';

export type Filters = { start: string; end: string; store: string; employee: string; kind: string; category: string };
export function filterTrades(trades: Trade[], filters: Filters): Trade[] {
  return trades.filter((trade) => trade.date >= filters.start && trade.date <= filters.end
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
    customers: new Set(trades.map((t) => t.customerId)).size };
}
