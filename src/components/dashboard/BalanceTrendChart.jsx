import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { useTransactionStore } from '../../store/useTransactionStore'
import { computeMonthlyTrend } from '../../utils/computeInsights'
import { formatCurrency } from '../../utils/formatters'

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      minWidth: 158,
      backdropFilter: 'blur(8px)',
    }}>
      {/* Month label */}
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-4)',
        marginBottom: 10,
      }}>
        {label}
      </p>

      {payload.map(p => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            marginBottom: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {/* Pill indicator */}
            <span style={{
              display: 'inline-block',
              width: 10, height: 3,
              borderRadius: 99,
              background: p.color,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 12, fontWeight: 500,
              textTransform: 'capitalize',
              color: 'var(--text-2)',
            }}>
              {p.dataKey}
            </span>
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: p.color,
          }}>
            {formatCurrency(p.value, true)}
          </span>
        </div>
      ))}

      {/* Net line */}
      {payload.length === 2 && (
        <div style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)' }}>Net</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            color: (payload[0].value - payload[1].value) >= 0 ? 'var(--income)' : 'var(--expense)',
          }}>
            {formatCurrency(payload[0].value - payload[1].value, true)}
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Custom active dot ───────────────────────────────────────────────────── */
function ActiveDot({ cx, cy, stroke }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7}  fill={stroke} opacity={0.15} />
      <circle cx={cx} cy={cy} r={4}  fill={stroke} />
      <circle cx={cx} cy={cy} r={2}  fill="#fff" />
    </g>
  )
}

/* ── Chart ───────────────────────────────────────────────────────────────── */
export default function BalanceTrendChart() {
  const transactions = useTransactionStore(s => s.transactions)
  const data = computeMonthlyTrend(transactions)

  const LEGEND = [
    { color: '#16a34a', label: 'Income',  key: 'income'  },
    { color: '#dc2626', label: 'Expense', key: 'expense' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card style={{
        padding: '22px 22px 16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 className="ff-display fw-700" style={{ fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>
              Cash Flow
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Income vs Expenses — last 6 months</p>
          </div>

          {/* Legend pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {LEGEND.map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  display: 'inline-block',
                  width: 20, height: 3,
                  borderRadius: 99,
                  background: color,
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={232}>
          <AreaChart data={data} margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
            <defs>
              {/* Income gradient — rich top, fully transparent at base */}
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#16a34a" stopOpacity={0.28} />
                <stop offset="55%"  stopColor="#16a34a" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0}    />
              </linearGradient>

              {/* Expense gradient */}
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#dc2626" stopOpacity={0.22} />
                <stop offset="55%"  stopColor="#dc2626" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0}    />
              </linearGradient>

              {/* Cursor vertical line gradient */}
              <linearGradient id="cursorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--text-3)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--text-3)" stopOpacity={0}   />
              </linearGradient>
            </defs>

            {/* Grid — horizontal only, very faint dashes */}
            <CartesianGrid
              strokeDasharray="4 6"
              stroke="var(--border)"
              strokeOpacity={0.7}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 600, fill: 'var(--text-4)', fontFamily: 'Plus Jakarta Sans' }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-4)', fontFamily: 'Plus Jakarta Sans' }}
              tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'}
              width={44}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'url(#cursorGrad)',
                strokeWidth: 1.5,
                strokeDasharray: '4 3',
              }}
            />

            {/* Income area */}
            <Area
              type="monotoneX"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={<ActiveDot />}
            />

            {/* Expense area */}
            <Area
              type="monotoneX"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={<ActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
