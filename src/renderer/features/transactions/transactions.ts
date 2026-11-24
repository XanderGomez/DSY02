import type { RecordedTrade } from '../../../shared/contracts/credit';

export type Trade = RecordedTrade & { date: string; amount: number; time: string };

export function localDate(when: Date): string {
  return [when.getFullYear(), String(when.getMonth() + 1).padStart(2, '0'), String(when.getDate()).padStart(2, '0')].join('-');
}

export function toDisplayTrade(record: RecordedTrade): Trade {
  const when = new Date(record.recordedAt);
  return {
    ...record, date: localDate(when), amount: record.amountCents / 100,
    time: when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

// POS references are strings: preserve leading zeros and support partial receipt numbers.
export function searchTransactions(records: Trade[], query: string): Trade[] {
  const term = query.trim().toLowerCase();
  return records.filter((trade) => !term || trade.posTransactionId?.toLowerCase().includes(term));
}
