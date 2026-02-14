import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount || 0);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';

  return formatDistanceToNow(d, { addSuffix: true });
};

/**
 * Format date for API (ISO string)
 */
export const formatDateForAPI = (date) => {
  if (!date) return '';
  return format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');
};

/**
 * Format compact number (e.g., 1.2K, 3.5M)
 */
export const formatCompactNumber = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() || '0';
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Food & Dining': '#f97316',
    'Transportation': '#3b82f6',
    'Shopping': '#ec4899',
    'Entertainment': '#8b5cf6',
    'Bills & Utilities': '#ef4444',
    'Healthcare': '#10b981',
    'Education': '#06b6d4',
    'Travel': '#f59e0b',
    'Groceries': '#22c55e',
    'Rent': '#f43f5e',
    'Insurance': '#6366f1',
    'Savings & Investments': '#14b8a6',
    'Personal Care': '#d946ef',
    'Gifts & Donations': '#fb923c',
    'Subscriptions': '#a855f7',
    'Other': '#64748b',
  };
  return colors[category] || '#64748b';
};

/**
 * Get category icon name (for react-icons)
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'Food & Dining': 'MdRestaurant',
    'Transportation': 'MdDirectionsCar',
    'Shopping': 'MdShoppingBag',
    'Entertainment': 'MdMovieFilter',
    'Bills & Utilities': 'MdReceipt',
    'Healthcare': 'MdLocalHospital',
    'Education': 'MdSchool',
    'Travel': 'MdFlight',
    'Groceries': 'MdShoppingCart',
    'Rent': 'MdHome',
    'Insurance': 'MdSecurity',
    'Savings & Investments': 'MdTrendingUp',
    'Personal Care': 'MdSpa',
    'Gifts & Donations': 'MdCardGiftcard',
    'Subscriptions': 'MdSubscriptions',
    'Other': 'MdMoreHoriz',
  };
  return icons[category] || 'MdMoreHoriz';
};

/**
 * Calculate percentage change
 */
export const getPercentageChange = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
