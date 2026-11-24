const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createCreditSession } = require('../../../src/backend/services/credit.ts');
const { createMemoryCreditStore } = require('../../../src/backend/storage/memory/creditStore.ts');
const { searchTransactions, toDisplayTrade } = require('../../../src/renderer/features/transactions/transactions.ts');

const input = {
  kind: 'Trade in', customerId: 1, amount: '25', posTransactionId: '00123',
  item: 'Game', category: 'Video games', description: 'Box included',
  employeeId: '1042', employee: 'Jordan Davis', store: 'North Location',
};
function start() {
  const service = createCreditSession(createMemoryCreditStore([
    { id: 1, name: 'Ava', email: '', phone: '555-0100', balanceCents: 0 },
  ]));
  return service;
}

test('issue, redeem, reject an overdraft and find both completed receipts', () => {
  const service = start();
  service.recordTrade(input);
  service.recordTrade({ ...input, kind: 'Trade out', amount: '10', posTransactionId: '00124' });
  const state = service.snapshot();
  assert.equal(state.customers[0].balanceCents, 1500);
  assert.throws(() => service.recordTrade({ ...input, kind: 'Trade out', amount: '16' }), /Available credit is \$15\.00/);
  assert.deepEqual(service.snapshot(), state);
  const matching = searchTransactions(state.transactions.map(toDisplayTrade), '0012');
  assert.deepEqual(matching.map((t) => [t.kind, t.amount, t.account]), [['Trade out', 10, 'Ava'], ['Trade in', 25, 'Ava']]);
  assert.notEqual(matching[0].id, matching[1].id);
  service.recordTrade({ ...input, kind: 'Trade out', amount: '15' });
  assert.equal(service.snapshot().customers[0].balanceCents, 0);
});

test('invalid input leaves the balance and receipt list untouched', () => {
  const service = start();
  const before = service.snapshot();
  for (const bad of [{ amount: '0' }, { amount: '-1' }, { amount: '1.001' }, { amount: 'Infinity' },
    { amount: '90071992547409.92' }, { posTransactionId: ' ' }, { item: '' }, { customerId: 99 }]) {
    assert.throws(() => service.recordTrade({ ...input, ...bad }));
    assert.deepEqual(service.snapshot(), before);
  }
});

test('new accounts use exact cents and a fresh session restores the seed', () => {
  const service = start();
  service.addCustomer({ id: 2, name: '', phone: '555-0101', email: '' });
  for (const amount of ['0.10', '0.20']) service.recordTrade({ ...input, customerId: 2, amount });
  assert.deepEqual(service.snapshot().customers.map((c) => [c.id, c.balanceCents]), [[2, 30], [1, 0]]);
  assert.equal(service.snapshot().transactions[0].account, '555-0101');
  const fresh = start().snapshot();
  assert.equal(fresh.customers.length, 1);
  assert.equal(fresh.transactions.length, 0);
});

test('the video demo reconciles every balance to receipts, accepts new trades, and resets', () => {
  const { createDemoSession } = require('../../../src/backend/storage/memory/demoSession.ts');
  const today = new Date(2026, 10, 24, 10);
  const { credit, directory } = createDemoSession(today);
  const initial = credit.snapshot();
  const balances = new Map(initial.customers.map((customer) => [customer.id, 0]));
  for (const receipt of [...initial.transactions].reverse()) {
    assert.ok(directory.employees.some((employee) => employee.id === receipt.employeeId && employee.name === receipt.employee));
    assert.ok(directory.stores.some((store) => store.name === receipt.store));
    const next = balances.get(receipt.customerId) + (receipt.kind === 'Trade in' ? receipt.amountCents : -receipt.amountCents);
    assert.ok(next >= 0);
    balances.set(receipt.customerId, next);
  }
  for (const customer of initial.customers) assert.equal(customer.balanceCents, balances.get(customer.id));
  assert.equal(balances.get(1), 12550);
  assert.equal(balances.get(2), 4800);
  assert.equal(balances.get(3), 0);
  credit.recordTrade({ ...input, kind: 'Trade out', amount: '10' });
  const updated = credit.snapshot();
  assert.equal(updated.customers.find((c) => c.id === 1).balanceCents, 11550);
  assert.equal(new Set(updated.transactions.map((t) => t.id)).size, initial.transactions.length + 1);
  assert.deepEqual(createDemoSession(today).credit.snapshot(), initial);
});
