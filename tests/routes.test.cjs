const { test } = require('node:test');
const assert = require('node:assert/strict');
const { backDestination, parseRoute, routePath } = require('../src/routes.ts');

test('all pages round-trip through hash URLs', () => {
  const routes = [
    { page: 'store' }, { page: 'login' }, { page: 'search' }, { page: 'manager' },
    { page: 'account', customerId: 1 },
    { page: 'trade-in', customerId: 2 },
    { page: 'trade-out', customerId: 3 },
  ];
  for (const route of routes) assert.deepEqual(parseRoute(`#${routePath(route)}`), route);
});

test('trade back navigation preserves the customer, including direct links', () => {
  for (const page of ['trade-in', 'trade-out']) {
    const current = parseRoute(`#/customers/42/${page}`);
    assert.deepEqual(backDestination(current).route, { page: 'account', customerId: 42 });
  }
});

test('shared back navigation has safe destinations and stops at the session root', () => {
  assert.deepEqual(backDestination({ page: 'account', customerId: 42 }).route, { page: 'search' });
  assert.deepEqual(backDestination({ page: 'manager' }).route, { page: 'search' });
  assert.deepEqual(backDestination({ page: 'login' }).route, { page: 'store' });
  assert.equal(backDestination({ page: 'search' }), null);
  assert.equal(backDestination({ page: 'store' }), null);
});

test('an empty URL opens login', () => {
  assert.deepEqual(parseRoute(''), { page: 'login' });
  assert.deepEqual(parseRoute('#'), { page: 'login' });
});

test('invalid routes cannot select a customer or trade page', () => {
  for (const hash of ['#/missing', '#/customers/abc', '#/customers/-1', '#/customers/1/delete', '#/customers/1/trade-in/extra', '#/customers/9007199254740992']) {
    assert.equal(parseRoute(hash), null);
  }
});
