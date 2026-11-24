const { test } = require('node:test');
const assert = require('node:assert/strict');
const { searchEmployees } = require('../src/renderer/features/session/employeeSearch.ts');

const employees = [
  { id: '0012', name: 'Jordan Davis' },
  { id: '1087', name: 'Alex Kim' },
  { id: '1124', name: 'Jordan Davis' },
];

test('employee search matches partial names regardless of case, spacing, or word order', () => {
  assert.deepEqual(searchEmployees(employees, '  DAV   jor  '), [employees[0], employees[2]]);
  assert.deepEqual(searchEmployees(employees, 'kim'), [employees[1]]);
});

test('employee IDs distinguish duplicate names and preserve leading zeros', () => {
  assert.deepEqual(searchEmployees(employees, '#0012'), [employees[0]]);
  assert.deepEqual(searchEmployees(employees, 'Jordan 1124'), [employees[2]]);
  assert.deepEqual(searchEmployees(employees, '087'), [employees[1]]);
});

test('empty and missing searches are safe and do not change the staff directory', () => {
  const before = structuredClone(employees);
  assert.deepEqual(searchEmployees(employees, '  '), employees);
  assert.deepEqual(searchEmployees(employees, 'nobody'), []);
  assert.deepEqual(searchEmployees([], 'alex'), []);
  assert.deepEqual(employees, before);
});
