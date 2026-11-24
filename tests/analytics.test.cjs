const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterTrades, summarize } = require('../src/renderer/features/manager/analytics.ts');
const { toDisplayTrade } = require('../src/renderer/features/transactions/transactions.ts');
const { createDemoSession } = require('../src/backend/storage/memory/demoSession.ts');
const trades = createDemoSession(new Date(2026, 10, 12, 12)).credit.snapshot().transactions.map(toDisplayTrade);
const all = { start: '2026-11-06', end: '2026-11-12', store: '', employee: '', kind: '', category: '' };

test('ledger totals include both directions and reconcile', () => {
  const result = summarize(filterTrades(trades, all));
  assert.equal(result.count, 9);
  assert.equal(result.issued, 260.5);
  assert.equal(result.redeemed, 87);
  assert.equal(result.net, 173.5);
  assert.equal(result.average, 347.5 / 9);
});

test('date endpoints are inclusive and every filter combines', () => {
  const result = filterTrades(trades, { ...all, start: '2026-11-12', store: 'North Location', employee: '1042', kind: 'Trade in', category: 'Video games' });
  assert.deepEqual(result.map((t) => t.posTransactionId), ['102841']);
  assert.equal(summarize(result).issued, 42.5);
  assert.equal(filterTrades(trades, { ...all, end: '2026-11-06' }).length, 1);
});

test('empty and reversed ranges produce finite zero summaries', () => {
  for (const filters of [{ ...all, store: 'missing' }, { ...all, start: '2026-11-13' }]) {
    assert.deepEqual(summarize(filterTrades(trades, filters)), { issued: 0, redeemed: 0, net: 0, count: 0, average: 0, customers: 0 });
  }
});

test('each analytics filter changes the transaction records independently', () => {
  const cases = [
    [{ store: 'Millard Location' }, ['102840', '102839', '102837', '102834']],
    [{ employee: '1124' }, ['102840', '102838', '102835']],
    [{ kind: 'Trade out' }, ['102840', '102838', '102837', '102836']],
    [{ category: 'Video games' }, ['102841', '102834']],
    [{ start: '2026-11-12' }, ['102841']],
    [{ end: '2026-11-07' }, ['102834', '102833']],
  ];
  for (const [change, expected] of cases) {
    const records = filterTrades(trades, { ...all, ...change });
    assert.deepEqual(records.map((trade) => trade.posTransactionId), expected);
    assert.equal(summarize(records).count, expected.length);
  }
});

test('changing and clearing filters replaces the matching records without modifying the mock ledger', () => {
  const original = JSON.stringify(trades);
  const employee = { ...all, employee: '1087' };
  assert.equal(filterTrades(trades, { ...employee, kind: 'Trade out' }).length, 1);
  assert.equal(filterTrades(trades, { ...employee, kind: 'Trade in' }).length, 2);
  assert.equal(filterTrades(trades, all).length, 9);
  assert.equal(JSON.stringify(trades), original);
});
