const { test } = require('node:test');
const assert = require('node:assert/strict');
const { searchTransactions, toDisplayTrade } = require('../src/renderer/features/transactions/transactions.ts');

const { createDemoSession } = require('../src/backend/storage/memory/demoSession.ts');
const trades = createDemoSession().credit.snapshot().transactions.map(toDisplayTrade);

test('history shows all records when search is empty and searches POS references', () => {
  assert.equal(searchTransactions(trades, '').length, trades.length);
  assert.deepEqual(searchTransactions(trades, ' 102841 ').map((t) => t.item), ['The Legend of Zelda: Breath of the Wild']);
  assert.equal(searchTransactions(trades, '10284').length, 2);
  assert.equal(searchTransactions(trades, 'TR-2841').length, 0);
  assert.equal(searchTransactions(trades, 'does-not-exist').length, 0);
});

test('POS lookup preserves leading zeros, finds duplicate references, and handles missing references', () => {
  const records = [{ id: 'a', posTransactionId: '001-AbC' }, { id: 'b', posTransactionId: '001-AbC' }, { id: 'c' }];
  assert.deepEqual(searchTransactions(records, '001-abc').map((t) => t.id), ['a', 'b']);
  assert.equal(searchTransactions(records, '').length, 3);
});
