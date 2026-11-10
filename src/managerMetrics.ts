export type Trade = {
  id: string;
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
  { id: 'TR-2841', kind: 'Trade in', account: 'Maya Thompson', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'The Legend of Zelda: Breath of the Wild', category: 'Video games', amount: 42.5, time: '10:42 AM', day: 'Today' },
  { id: 'TR-2840', kind: 'Trade out', account: 'Liam Carter', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Dungeons & Dragons Player’s Handbook', category: 'Books', amount: 28, time: '10:18 AM', day: 'Today' },
  { id: 'TR-2839', kind: 'Trade in', account: 'Elena Garcia', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Magic: The Gathering card collection', category: 'Trading cards', amount: 65, time: '9:56 AM', day: 'Today' },
  { id: 'TR-2838', kind: 'Trade in', account: 'Oliver Reed', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Catan board game', category: 'Board games', amount: 18.75, time: '9:21 AM', day: 'Today' },
  { id: 'TR-2837', kind: 'Trade out', account: 'Sofia Patel', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Warhammer miniature set', category: 'Miniatures', amount: 35, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2836', kind: 'Trade in', account: 'Ethan Brooks', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Pokémon card collection', category: 'Trading cards', amount: 53.25, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2835', kind: 'Trade in', account: 'Nora Wilson', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Ticket to Ride board game', category: 'Board games', amount: 31, time: 'Yesterday', day: 'Yesterday' },
  { id: 'TR-2834', kind: 'Trade in', account: 'Theo Martin', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Nintendo Switch game bundle', category: 'Video games', amount: 24, time: 'Monday', day: 'Monday' },
  { id: 'TR-2833', kind: 'Trade out', account: 'Avery Scott', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Pathfinder core rulebook', category: 'Books', amount: 19.5, time: 'Monday', day: 'Monday' },
  { id: 'TR-2832', kind: 'Trade in', account: 'Isabel Moore', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Yu-Gi-Oh! card collection', category: 'Trading cards', amount: 46, time: 'Tuesday', day: 'Tuesday' },
  { id: 'TR-2831', kind: 'Trade in', account: 'Caleb Young', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Xbox game bundle', category: 'Video games', amount: 37.5, time: 'Wednesday', day: 'Wednesday' },
  { id: 'TR-2830', kind: 'Trade in', account: 'Zoe Adams', employee: 'Morgan Lee', employeeId: '1124', store: 'North Location', item: 'Carcassonne board game', category: 'Board games', amount: 29, time: 'Thursday', day: 'Thursday' },
  { id: 'TR-2829', kind: 'Trade in', account: 'Milo Baker', employee: 'Jordan Davis', employeeId: '1042', store: 'North Location', item: 'Dragonlance novel collection', category: 'Books', amount: 58, time: 'Friday', day: 'Friday' },
  { id: 'TR-2828', kind: 'Trade out', account: 'Ruby Evans', employee: 'Alex Kim', employeeId: '1087', store: 'Millard Location', item: 'Pokémon Elite Trainer Box', category: 'Trading cards', amount: 22, time: 'Saturday', day: 'Saturday' },
];

// Relative labels keep the fixture independent of the real calendar date.
// Saturday and Yesterday represent the same day in this sample week.
export const activityDays: { label: string; days: Trade['day'][] }[] = [
  { label: '6 days ago', days: ['Monday'] },
  { label: '5 days ago', days: ['Tuesday'] },
  { label: '4 days ago', days: ['Wednesday'] },
  { label: '3 days ago', days: ['Thursday'] },
  { label: '2 days ago', days: ['Friday'] },
  { label: 'Yesterday', days: ['Saturday', 'Yesterday'] },
  { label: 'Today', days: ['Today'] },
];

export type Period = 'Today' | 'Last 7 days';

export function getPeriodTrades(period: Period, activity: Trade[] = trades) {
  return period === 'Today' ? activity.filter(({ day }) => day === 'Today') : activity;
}

export function summarizeTrades(activity: Trade[]) {
  const issuedCents = activity.filter(({ kind }) => kind === 'Trade in')
    .reduce((sum, { amount }) => sum + Math.round(amount * 100), 0);
  const redeemedCents = activity.filter(({ kind }) => kind === 'Trade out')
    .reduce((sum, { amount }) => sum + Math.round(amount * 100), 0);
  const tradeIns = activity.filter(({ kind }) => kind === 'Trade in').length;
  return {
    issued: issuedCents / 100,
    redeemed: redeemedCents / 100,
    net: (issuedCents - redeemedCents) / 100,
    count: activity.length,
    tradeIns,
    tradeOuts: activity.length - tradeIns,
    averageIssued: tradeIns ? issuedCents / 100 / tradeIns : 0,
  };
}
