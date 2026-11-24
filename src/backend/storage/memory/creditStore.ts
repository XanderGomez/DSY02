import { balanceAfterTrade } from '../../domain/rules/credit.ts';
import type { CreditSnapshot, Customer } from '../../../shared/contracts/credit';
import type { CreditStore } from '../interfaces/creditStore';

export function createMemoryCreditStore(customers: Customer[]): CreditStore {
  let state: CreditSnapshot = { customers: structuredClone(customers), transactions: [] };
  return {
    snapshot: () => structuredClone(state),
    addCustomer(customer) {
      if (state.customers.some(({ id }) => id === customer.id)) {
        throw new Error('This account already exists.');
      }
      state = { ...state, customers: [customer, ...state.customers] };
    },
    post(trade) {
      const customer = state.customers.find(({ id }) => id === trade.customerId);
      if (!customer) throw new Error('Customer account could not be found.');
      const balanceCents = balanceAfterTrade(customer.balanceCents, trade.kind, trade.amountCents);
      const receipt = { ...trade, id: `TR-S${state.transactions.length + 1}`, account: customer.name || customer.phone };
      state = {
        customers: state.customers.map((row) => row.id === customer.id ? { ...customer, balanceCents } : row),
        transactions: [receipt, ...state.transactions],
      };
    },
  };
}
