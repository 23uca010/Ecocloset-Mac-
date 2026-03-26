export const formatCurrency = (amount) => {
  // Math.round() prevents floating-point drift (e.g. SQLite REAL storing 100 as 99.9999...)
  // from causing Intl.NumberFormat to display ₹99 instead of ₹100.
  const safe = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safe);
};

/**
 * Display price label based on listing type and price value.
 * - sell items with a price → ₹1,234
 * - swap/swap_only items        → "Swap"
 * - donate/donation items       → "Free"
 * - anything with no price      → "Not specified"
 */
export const formatItemPrice = (item) => {
  const type = item?.listingType || item?.type || '';
  const price = Number(item?.price);

  if (type === 'swap' || type === 'swap_only') return 'Swap';
  if (type === 'donate' || type === 'donation') return 'Free';
  if (price > 0) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(price));
  }
  return 'Not specified';
};
