/**
 * Card
 *
 * flat       — no shadow, just border (e.g. inner panels)
 * interactive — adds pointer cursor; use for clickable cards
 *
 * Hover lift (.card:hover) is defined in CSS and applies to all .card
 * elements. Disable it per-instance via className="card" + inline
 * style overrides if a card should never lift (rare).
 */
export default function Card({ children, className = '', flat = false, interactive = false, ...props }) {
  return (
    <div
      className={`${flat ? 'card-flat' : 'card'} ${interactive ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
