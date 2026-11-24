export function balanceAfterTrade(balanceCents: number, kind: 'Trade in' | 'Trade out', amountCents: number) {
  const next = kind === 'Trade in' ? balanceCents + amountCents : balanceCents - amountCents;
  if (next < 0) {
    throw new Error(`Available credit is $${(balanceCents / 100).toFixed(2)}. Enter a smaller amount.`);
  }
  if (!Number.isSafeInteger(next)) throw new Error('That amount exceeds the supported balance.');
  return next;
}
