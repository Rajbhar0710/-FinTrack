import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { useTransactionStore } from '../../store/useTransactionStore'
import { computeCategoryBreakdown } from '../../utils/computeInsights'
import { getCategoryColor } from '../../utils/categoryColors'
import { formatCurrency } from '../../utils/formatters'

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  const pct = d.payload.pct
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${d.payload.fill}33`,
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: `0 8px 28px rgba(0,0,0,0.12), 0 0 0 1px ${d.payload.fill}22`,
      minWidth: 140,
    }}>
      {/* Color swatch + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: d.payload.fill,
          flexShrink: 0,
          boxShadow: `0 0 6px ${d.payload.fill}66`,
        }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{d.name}</span>
      </div>
      {/* Amount */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 15,
        fontWeight: 700,
        color: d.payload.fill,
        marginBottom: 2,
      }}>
        {formatCurrency(d.value)}
      </p>
      {/* Percentage */}
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)' }}>
        {pct}% of total
      </p>
    </div>
  )
}

/* ── Custom active shape — outer ring glow ───────────────────────────────── */
function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  // Recharts renders active shape inline; use SVG arc via path trick via sector
  // Simple: just expand the slice slightly
  const RADIAN = Math.PI / 180
  const expand = 5
  const r = outerRadius + expand

  // re-export the same sector but bigger using SVG arc manually
  const x1 = cx + r * Math.cos(-startAngle * RADIAN)
  const y1 = cy + r * Math.sin(-startAngle * RADIAN)
  const x2 = cx + r * Math.cos(-endAngle   * RADIAN)
  const y2 = cy + r * Math.sin(-endAngle   * RADIAN)
  const xi1 = cx + innerRadius * Math.cos(-startAngle * RADIAN)
  const yi1 = cy + innerRadius * Math.sin(-startAngle * RADIAN)
  const xi2 = cx + innerRadius * Math.cos(-endAngle   * RADIAN)
  const yi2 = cy + innerRadius * Math.sin(-endAngle   * RADIAN)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return (
    <g>
      {/* Soft glow ring */}
      <circle cx={cx} cy={cy} r={outerRadius + 10} fill={fill} opacity={0.07} />
      {/* Expanded slice */}
      <path
        d={`
          M ${xi1} ${yi1}
          L ${x1} ${y1}
          A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}
          L ${xi2} ${yi2}
          A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${xi1} ${yi1}
          Z
        `}
        fill={fill}
        opacity={0.95}
      />
    </g>
  )
}

/* ── Chart ───────────────────────────────────────────────────────────────── */
export default function SpendingPieChart() {
  const transactions = useTransactionStore(s => s.transactions)
  const raw   = computeCategoryBreakdown(transactions)
  const total = raw.reduce((s, d) => s + d.value, 0)
  const data  = raw.slice(0, 6).map((d, i) => ({
    ...d,
    fill: getCategoryColor(d.name).color,
    pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : '0',
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      <Card style={{
        padding: '22px 22px 18px',
        height: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <h3 className="ff-display fw-700" style={{ fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>
            Spending
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-4)' }}>By category</p>
        </div>

        {/* Donut */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <defs>
                {/* Subtle drop shadow filter on chart */}
                <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.10" />
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={52}
                outerRadius={76}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--surface)"
                paddingAngle={3}
                activeShape={<ActiveShape />}
                filter="url(#pieShadow)"
              >
                {data.map(entry => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            pointerEvents: 'none',
          }}>
            {/* Top label */}
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--text-4)',
              lineHeight: 1,
            }}>
              Total Spent
            </span>

            {/* Amount — rupee formatted, large + bold */}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              ₹{(total / 1000).toFixed(1)}k
            </span>

            {/* Category count sub-label */}
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              color: 'var(--text-4)',
              lineHeight: 1,
              marginTop: 1,
            }}>
              {data.length} categories
            </span>
          </div>
        </div>

        {/* Legend — with micro progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {data.map((d, i) => {
            const pct = total > 0 ? (d.value / total) * 100 : 0
            return (
              <div key={d.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: d.fill,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-2)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {d.name}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-3)',
                    flexShrink: 0,
                  }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
                {/* Micro progress bar */}
                <div style={{
                  width: '100%',
                  height: 3,
                  background: 'var(--surface-3)',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 99, background: d.fill }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
