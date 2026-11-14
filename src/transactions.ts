export type Trade = {
  id: string;
  posTransactionId?: string;
  kind: 'Trade in' | 'Trade out';
  account: string;
  employee: string;
  employeeId: string;
  store: string;
  item: string;
  category: string;
  amount: number;
  time: string;
  day: 'Today' | 'Yesterday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
};

export const trades: Trade[] = [
  { id: 'TR-2841', posTransactionId: '102841', kind: 'Trade in', account: 'Maya Thompson', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'The Legend of Zelda: Breath of the Wild', category: 'Video games', amount: 42.5, time: '10:42 AM', day: 'Today' },
  { id: 'TR-2840', posTransactionId: '102840', kind: 'Trade out', account: 'Liam Carter', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Dungeons & Dragons Player’s Handbook', category: 'Books', amount: 28, time: '10:18 AM', day: 'Today' },
  { id: 'TR-2839', posTransactionId: '102839', kind: 'Trade in', account: 'Elena Garcia', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Magic: The Gathering card collection', category: 'Trading cards', amount: 65, time: '9:56 AM', day: 'Today' },
  { id: 'TR-2838', posTransactionId: '102838', kind: 'Trade in', account: 'Oliver Reed', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Catan board game', category: 'Board games', amount: 18.75, time: '9:21 AM', day: 'Today' },
  { id: 'TR-2837', posTransactionId: '102837', kind: 'Trade out', account: 'Sofia Patel', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Warhammer miniature set', category: 'Miniatures', amount: 35, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2836', posTransactionId: '102836', kind: 'Trade in', account: 'Ethan Brooks', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Pokémon card collection', category: 'Trading cards', amount: 53.25, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2835', posTransactionId: '102835', kind: 'Trade in', account: 'Nora Wilson', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Ticket to Ride board game', category: 'Board games', amount: 31, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2834', posTransactionId: '102834', kind: 'Trade in', account: 'Theo Martin', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Nintendo Switch game bundle', category: 'Video games', amount: 24, time: 'Monday', day: 'Monday' },
  { id: 'TR-2833', posTransactionId: '102833', kind: 'Trade out', account: 'Avery Scott', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Pathfinder core rulebook', category: 'Books', amount: 19.5, time: 'Monday', day: 'Monday' },
  { id: 'TR-2832', posTransactionId: '102832', kind: 'Trade in', account: 'Isabel Moore', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Yu-Gi-Oh! card collection', category: 'Trading cards', amount: 46, time: 'Tuesday', day: 'Tuesday' },
  { id: 'TR-2831', posTransactionId: '102831', kind: 'Trade in', account: 'Caleb Young', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Xbox game bundle', category: 'Video games', amount: 37.5, time: 'Wednesday', day: 'Wednesday' },
  { id: 'TR-2830', posTransactionId: '102830', kind: 'Trade in', account: 'Zoe Adams', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Carcassonne board game', category: 'Board games', amount: 29, time: 'Thursday', day: 'Thursday' },
  { id: 'TR-2829', posTransactionId: '102829', kind: 'Trade in', account: 'Milo Baker', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Dragonlance novel collection', category: 'Books', amount: 58, time: 'Friday', day: 'Friday' },
  { id: 'TR-2828', posTransactionId: '102828', kind: 'Trade out', account: 'Ruby Evans', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Pokémon Elite Trainer Box', category: 'Trading cards', amount: 22, time: 'Saturday', day: 'Saturday' },
];


// POS references are strings: preserve leading zeros and support partial receipt numbers.
export function searchTransactions(records: Trade[], query: string): Trade[] {
  const term = query.trim().toLowerCase();
  return records.filter((trade) => !term || trade.posTransactionId?.toLowerCase().includes(term));
}
