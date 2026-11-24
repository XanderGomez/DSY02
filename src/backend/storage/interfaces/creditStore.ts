import type { CreditSnapshot, Customer, RecordedTrade } from '../../../shared/contracts/credit';

export interface CreditStore {
  snapshot(): CreditSnapshot;
  addCustomer(customer: Customer): void;
  // Store the receipt and change its customer's balance as one operation.
  post(trade: Omit<RecordedTrade, 'account' | 'id'>): void;
}
