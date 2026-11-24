import { createCreditSession } from '../../services/credit.ts';
import { createMemoryCreditStore } from './creditStore.ts';
import type { StoreDirectory } from '../../../shared/contracts/staff';

const north = { id: 'north', name: 'North Location', address: '2311 N. 90th St., Omaha, NE 68134', phone: '(402) 399-9141' };
const millard = { id: 'millard', name: 'Millard Location', address: '14616 W. Center Rd., Omaha, NE 68144', phone: '(402) 895-5653' };
const jordan = { id: '1042', name: 'Jordan Davis' };
const alex = { id: '1087', name: 'Alex Kim' };
const morgan = { id: '1124', name: 'Morgan Lee' };

const olivia = { id: 1, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(402) 555-0142' };
const noah = { id: 2, name: 'Noah Williams', email: 'noah.williams@email.com', phone: '(402) 555-0188' };
const ava = { id: 3, name: 'Ava Martinez', email: 'ava.martinez@email.com', phone: '(402) 555-0126' };

// Oldest first so each redemption spends credit the customer already earned.
const visits = [
  { daysAgo: 6, customer: olivia, staff: jordan, location: north, kind: 'Trade in', amount: '98', item: 'Magic: The Gathering binder', category: 'Magic: The Gathering', pos: '102833' },
  { daysAgo: 5, customer: noah, staff: alex, location: millard, kind: 'Trade in', amount: '60', item: 'Xbox game bundle', category: 'Video games', pos: '102834' },
  { daysAgo: 4, customer: ava, staff: morgan, location: north, kind: 'Trade in', amount: '25', item: 'Catan base game', category: 'Board games', pos: '102835' },
  { daysAgo: 3, customer: olivia, staff: jordan, location: north, kind: 'Trade out', amount: '15', item: 'Dungeons & Dragons starter set', category: 'Roleplaying games', pos: '102836' },
  { daysAgo: 2, customer: noah, staff: alex, location: millard, kind: 'Trade out', amount: '12', item: 'Metal dice set', category: 'Dice', pos: '102837' },
  { daysAgo: 2, customer: ava, staff: morgan, location: north, kind: 'Trade out', amount: '25', item: 'Painted adventurer figures', category: 'Figures', pos: '102838' },
  { daysAgo: 1, customer: noah, staff: alex, location: millard, kind: 'Trade in', amount: '35', item: 'Pokémon card collection', category: 'Pokémon', pos: '102839' },
  { daysAgo: 1, customer: noah, staff: morgan, location: millard, kind: 'Trade out', amount: '35', item: 'Warhammer miniatures', category: 'Miniatures', pos: '102840' },
  { daysAgo: 0, customer: olivia, staff: jordan, location: north, kind: 'Trade in', amount: '42.50', item: 'The Legend of Zelda: Breath of the Wild', category: 'Video games', pos: '102841' },
] as const;

export function createDemoSession(today = new Date()) {
  const store = createMemoryCreditStore([]);
  const credit = createCreditSession(store);
  for (const customer of [ava, noah, olivia]) credit.addCustomer(customer);
  for (const [index, visit] of visits.entries()) {
    const recordedAt = new Date(today);
    if (visit.daysAgo > 0) {
      recordedAt.setDate(today.getDate() - visit.daysAgo);
      recordedAt.setHours(10 + index, 15, 0, 0);
    }
    const cashier = createCreditSession(store, () => recordedAt);
    cashier.recordTrade({
      customerId: visit.customer.id, employeeId: visit.staff.id, employee: visit.staff.name,
      store: visit.location.name, kind: visit.kind, amount: visit.amount,
      item: visit.item, category: visit.category, posTransactionId: visit.pos, description: '',
    });
  }
  const directory: StoreDirectory = { stores: [north, millard], employees: [jordan, alex, morgan] };
  return { credit, directory };
}
