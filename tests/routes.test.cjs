const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseRoute, routePath } = require('../src/routes.ts');

test('all pages round-trip through hash URLs', () => {
  const routes = [
    { page: 'login' }, { page: 'search' }, { page: 'manager' },
    { page: 'account', customerId: 1 },
    { page: 'trade-in', customerId: 2 },
    { page: 'trade-out', customerId: 3 },
  ];
  for (const route of routes) assert.deepEqual(parseRoute(`#${routePath(route)}`), route);
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
