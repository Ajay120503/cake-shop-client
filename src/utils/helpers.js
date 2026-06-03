export const formatPrice = (price) => {
  return '₹' + Number(price || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export const getPlaceholderImage = (name) => {
  return 'https://placehold.co/600x600/f9f1e6/b76e79?text=' + encodeURIComponent(name || 'Cake');
};
