export const tradeCategories = [
  'Trading cards',
  'Magic: The Gathering',
  'Pokémon',
  'Yu-Gi-Oh!',
  'Board games',
  'Strategy games',
  'Party games',
  'Roleplaying games',
  'Rulebooks',
  'Dice',
  'Miniatures',
  'Figures',
  'Paints & supplies',
  'Accessories',
  'Card sleeves',
  'Storage',
  'General',
  'Video games',
];

export type TradeDirection = 'in' | 'out';
export type CategoryTradeCounts = Partial<Record<string, number>>;

// Separate placeholders until completed-trade counts are supplied by the backend.
export const defaultTopCategories: Record<TradeDirection, string[]> = {
  in: ['Magic: The Gathering', 'Pokémon', 'Yu-Gi-Oh!'],
  out: ['Board games', 'Miniatures', 'Accessories'],
};

export function rankTradeCategories(direction: TradeDirection, counts: CategoryTradeCounts = {}) {
  const defaults = defaultTopCategories[direction];
  const ordered = [...defaults, ...tradeCategories.filter((category) => !defaults.includes(category))];
  return ordered.sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));
}
