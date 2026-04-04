export default function Badge({ type, children, className = '' }) {
  const cls = {
    income:  'badge-income',
    expense: 'badge-expense',
    neutral: 'badge-neutral',
    primary: 'badge-primary',
  }[type] || 'badge-neutral'

  return <span className={`badge ${cls} ${className}`}>{children}</span>
}
