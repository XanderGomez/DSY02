const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterTrades, summarize } = require('../src/analytics.ts');
const { trades } = require('../src/transactions.ts');
const all = { start: '2026-11-04', end: '2026-11-12', store: '', employee: '', kind: '', category: '' };

test('ledger totals include both directions and reconcile', () => {
  const result = summarize(filterTrades(trades, all));
  assert.equal(result.count, 14);
  assert.equal(result.issued, 405);
  assert.equal(result.redeemed, 104.5);
  assert.equal(result.net, 300.5);
  assert.equal(result.average, 509.5 / 14);
});

test('date endpoints are inclusive and every filter combines', () => {
  const result = filterTrades(trades, { ...all, start: '2026-11-12', store: 'North Location', employee: '1042', kind: 'Trade in', category: 'Trading cards' });
  assert.deepEqual(result.map((t) => t.id), ['TR-2839']);
  assert.equal(summarize(result).issued, 65);
  assert.equal(filterTrades(trades, { ...all, end: '2026-11-04' }).length, 1);
});

test('empty and reversed ranges produce finite zero summaries', () => {
  for (const filters of [{ ...all, store: 'missing' }, { ...all, start: '2026-11-13' }]) {
    assert.deepEqual(summarize(filterTrades(trades, filters)), { issued: 0, redeemed: 0, net: 0, count: 0, average: 0, customers: 0 });
  }
});

test('each analytics filter changes the transaction records independently', () => {
  const cases = [
    [{ store: 'Millard Location' }, ['TR-2840', 'TR-2837', 'TR-2834', 'TR-2831', 'TR-2828']],
    [{ employee: '1124' }, ['TR-2838', 'TR-2835', 'TR-2833', 'TR-2830']],
    [{ kind: 'Trade out' }, ['TR-2840', 'TR-2837', 'TR-2833', 'TR-2828']],
    [{ category: 'Books' }, ['TR-2840', 'TR-2833', 'TR-2829']],
    [{ start: '2026-11-12' }, ['TR-2841', 'TR-2840', 'TR-2839', 'TR-2838']],
    [{ end: '2026-11-05' }, ['TR-2831', 'TR-2830']],
  ];
  for (const [change, expected] of cases) {
    const records = filterTrades(trades, { ...all, ...change });
    assert.deepEqual(records.map((trade) => trade.id), expected);
    assert.equal(summarize(records).count, expected.length);
  }
});

test('changing and clearing filters replaces the matching records without modifying the mock ledger', () => {
  const original = JSON.stringify(trades);
  const employee = { ...all, employee: '1087' };
  assert.equal(filterTrades(trades, { ...employee, kind: 'Trade out' }).length, 3);
  assert.equal(filterTrades(trades, { ...employee, kind: 'Trade in' }).length, 2);
  assert.equal(filterTrades(trades, all).length, 14);
  assert.equal(JSON.stringify(trades), original);
});
