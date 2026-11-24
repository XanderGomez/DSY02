import type { StoreLocation } from '../../../shared/contracts/staff';

export function storeBanner(store: StoreLocation | null) {
  if (store?.id === 'north') return 'bg-blue-800 text-white';
  if (store?.id === 'millard') return 'bg-purple-800 text-white';
  return 'bg-stone-200 text-stone-800';
}
