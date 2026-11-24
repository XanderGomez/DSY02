import type { CreditSession } from '../../shared/contracts/credit';
import type { CreditStore } from '../storage/interfaces/creditStore';

export function createCreditSession(store: CreditStore, now = () => new Date()): CreditSession {
  return {
    snapshot: () => store.snapshot(),
    addCustomer: (customer) => store.addCustomer({ ...customer, balanceCents: 0 }),
    recordTrade(input) {
      const { amount, kind, ...fields } = input;
      const value = amount.trim();
      if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Enter a positive amount with up to two decimal places.');
      const [dollars, fraction = ''] = value.split('.');
      const amountCents = Number(dollars + fraction.padEnd(2, '0'));
      if (!Number.isSafeInteger(amountCents) || amountCents < 1) throw new Error('Enter a valid amount of at least $0.01.');
      if (kind !== 'Trade in' && kind !== 'Trade out') throw new Error('Choose a valid trade type.');
      if (!fields.category.trim() || !fields.item.trim()) throw new Error('Choose a category and enter the item name.');
      if (!fields.posTransactionId.trim()) throw new Error('Enter the related POS transaction ID.');
      if (!fields.employeeId.trim() || !fields.employee.trim() || !fields.store.trim()) throw new Error('Select a store and employee.');
      store.post({
        ...fields, kind, amountCents, item: fields.item.trim(), posTransactionId: fields.posTransactionId.trim(),
        recordedAt: now().toISOString(),
      });
    },
  };
}
