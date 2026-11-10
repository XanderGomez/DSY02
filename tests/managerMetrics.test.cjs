const { test } = require('node:test');
const assert = require('node:assert/strict');
const { activityDays, getPeriodTrades, summarizeTrades, trades } = require('../src/managerMetrics.ts');
const { storeLocations } = require('../src/session.ts');

test('store breakdown uses the current locations and reconciles with the summary', () => {
  const locations = storeLocations.map(({ name }) => name);
  assert.ok(trades.every(({ store }) => locations.includes(store)));
  for (const period of ['Today', 'Last 7 days']) {
    const activity = getPeriodTrades(period);
    const totals = locations.map((location) => summarizeTrades(activity.filter(({ store }) => store === location)));
    const summary = summarizeTrades(activity);
    for (const key of ['issued', 'redeemed', 'count']) {
      assert.equal(totals.reduce((sum, store) => sum + store[key], 0), summary[key]);
    }
  }
});

test('sample transactions retain item and category details for receipts', () => {
  for (const trade of trades) {
    assert.ok(trade.item?.trim(), `${trade.id} has an item`);
    assert.ok(trade.category?.trim(), `${trade.id} has a category`);
  }
  const receipt = trades.find(({ id }) => id === 'TR-2841');
  assert.equal(receipt.store, 'North Location');
  assert.equal(receipt.item, 'The Legend of Zelda: Breath of the Wild');
});

test('today separates issued credit, redeemed credit, and all transactions', () => {
  assert.deepEqual(summarizeTrades(getPeriodTrades('Today')), {
    issued: 126.25, redeemed: 28, net: 98.25, count: 4,
    tradeIns: 3, tradeOuts: 1, averageIssued: 126.25 / 3,
  });
});

test('every sample transaction belongs to exactly one chart day and totals reconcile', () => {
  for (const trade of trades) {
    assert.equal(activityDays.filter(({ days }) => days.includes(trade.day)).length, 1, trade.id);
  }
  const daily = activityDays.map(({ days }) => summarizeTrades(trades.filter(({ day }) => days.includes(day))));
  const summary = summarizeTrades(getPeriodTrades('Last 7 days'));
  assert.equal(summary.issued, 405);
  assert.equal(summary.redeemed, 104.5);
  assert.equal(summary.net, 300.5);
  for (const key of ['issued', 'redeemed', 'count']) {
    assert.equal(daily.reduce((sum, day) => sum + day[key], 0), summary[key]);
  }
  assert.equal(daily.find((_, index) => activityDays[index].label === 'Yesterday').issued, 84.25);
});

test('employees with only redemptions retain their activity and follow the period', () => {
  const employee = (period) => summarizeTrades(getPeriodTrades(period).filter(({ employeeId }) => employeeId === '1087'));
  assert.equal(employee('Today').issued, 0);
  assert.equal(employee('Today').redeemed, 28);
  assert.equal(employee('Today').count, 1);
  assert.equal(employee('Last 7 days').issued, 61.5);
  assert.equal(employee('Last 7 days').redeemed, 85);
});

test('empty activity and fractional currency do not produce invalid metrics', () => {
  assert.deepEqual(summarizeTrades([]), {
    issued: 0, redeemed: 0, net: 0, count: 0,
    tradeIns: 0, tradeOuts: 0, averageIssued: 0,
  });
  const summary = summarizeTrades([
    { ...trades[0], amount: 0.1 },
    { ...trades[0], amount: 0.2 },
    { ...trades[1], amount: 0.4 },
  ]);
  assert.equal(summary.issued, 0.3);
  assert.equal(summary.net, -0.1);
});
