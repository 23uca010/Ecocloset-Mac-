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
