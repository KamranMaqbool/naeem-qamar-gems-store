export function formatPrice(price, options = {}) {
  const { currency = 'USD', minimumFractionDigits = 0, priceOnRequest = false } = options;
  
  if (priceOnRequest) return 'Price on Request';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(price);
}

export function formatCarat(carat) {
  return `${parseFloat(carat).toFixed(2)} ct`;
}