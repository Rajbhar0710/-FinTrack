import { format, parseISO } from 'date-fns'

export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 1000) {
    return '$' + (amount / 1000).toFixed(1) + 'k'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr) {
  return formatDate(dateStr, 'MMM d')
}
