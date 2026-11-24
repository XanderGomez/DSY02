export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  balanceCents: number;
};

export type TradeFields = {
  category: string;
  item: string;
  description: string;
  posTransactionId: string;
  amount: string;
};

export type TradeRequest = TradeFields & {
  kind: 'Trade in' | 'Trade out';
  customerId: number;
  employeeId: string;
  employee: string;
  store: string;
};

export type RecordedTrade = Omit<TradeRequest, 'amount'> & {
  id: string;
  account: string;
  amountCents: number;
  recordedAt: string;
};

export type CreditSnapshot = { customers: Customer[]; transactions: RecordedTrade[] };

export interface CreditSession {
  snapshot(): CreditSnapshot;
  addCustomer(customer: Omit<Customer, 'balanceCents'>): void;
  recordTrade(input: TradeRequest): void;
}
