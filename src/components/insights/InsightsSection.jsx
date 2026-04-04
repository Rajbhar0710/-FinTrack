import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { useTransactionStore } from '../../store/useTransactionStore'
import {
  computeInsights,
  computeMonthlyTrend,
  computeCategoryBreakdown,
} from '../../utils/computeInsights'
import { getCategoryColor } from '../../utils/categoryColors'
import { formatCurrency } from '../../utils/formatters'
import {
  TrendingUp, TrendingDown, Award, PiggyBank, Activity, BarChart2
} from 'lucide-react'

function KPICard({ icon: Icon, label, value, sub, color, delay }) {
  const [hovered, setHovered] = useState(false)

  // Resolve CSS variables to real hex so we can build gradient strings from them
  // Each card carries its own accent — gradient goes from a faint tint to pure surface
  const gradientLight = `linear-gradient(145deg, ${color}0f 0%, ${color}05 60%, transparent 100%)`
  const gradientDark  = `linear-gradient(145deg, ${color}18 0%, ${color}08 60%, transparent 100%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      style={{
        background:   `var(--surface)`,
        backgroundImage: gradientLight,
        border:       `1px solid ${color}28`,
        borderRadius: 18,
        padding:      '22px 20px 18px',
        position:     'relative',
        overflow:     'hidden',
        cursor:       'default',
        // Lift + shadow on hover
        transform:    hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow:    hovered
          ? `0 12px 32px ${color}22, 0 4px 12px rgba(0,0,0,0.08)`
          : '0 1px 4px rgba(0,0,0,0.05)',
        transition:   'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        borderColor:  hovered ? `${color}44` : `${color}28`,
        willChange:   'transform',
      }}
    >
      {/* Decorative blurred circle — top-right corner depth effect */}
      <span style={{
        position:     'absolute',
        top:          -30, right: -30,
        width:        100, height: 100,
        borderRadius: '50%',
        background:   color,
        opacity:      hovered ? 0.07 : 0.04,
        filter:       'blur(24px)',
        transition:   'opacity 0.22s ease',
        pointerEvents:'none',
      }} />

      {/* Icon — large soft circle */}
      <div style={{
        width:          52,
        height:         52,
        borderRadius:   16,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     `${color}18`,
        border:         `1px solid ${color}28`,
        marginBottom:   16,
        // Scale icon container slightly on hover
        transform:      hovered ? 'scale(1.06)' : 'scale(1)',
        transition:     'transform 0.22s ease',
      }}>
        <Icon size={22} strokeWidth={1.8} style={{ color }} />
      </div>

      {/* Label */}
      <p style={{
        fontSize:      10,
        fontWeight:    700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color:         color,
        opacity:       0.8,
        marginBottom:  6,
        lineHeight:    1,
      }}>
        {label}
      </p>

      {/* Value — large display number */}
      <p style={{
        fontFamily:    "'Space Grotesk', sans-serif",
        fontSize:      'clamp(1.35rem, 2.2vw, 1.625rem)',
        fontWeight:    800,
        color:         'var(--text)',
        letterSpacing: '-0.02em',
        lineHeight:    1.1,
        marginBottom:  sub ? 8 : 0,
        overflow:      'hidden',
        textOverflow:  'ellipsis',
        whiteSpace:    'nowrap',
      }}>
        {value}
      </p>

      {/* Sub-line */}
      {sub && (
        <p style={{
          fontSize:   11,
          fontWeight: 500,
          color:      'var(--text-4)',
          lineHeight: 1.4,
          // Highlight numeric changes green/red
          ...(sub.includes('+') && { color: 'var(--income)' }),
          ...(sub.startsWith('-') && { color: 'var(--expense)' }),
        }}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}

function ChangeChip({ value }) {
  const up = value >= 0
  return (
    <span
      className="badge"
      style={{
        background: up ? 'var(--expense-light)' : 'var(--income-light)',
        color: up ? 'var(--expense)' : 'var(--income)',
      }}
    >
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

function MonthlyBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '12px 16px',
      boxShadow: 'var(--shadow-lg)',
      minWidth: 158,
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 10,
      }}>
        {label}
      </p>
      {payload.map(p => (
        <div key={p.dataKey} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 20, marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              display: 'inline-block', width: 10, height: 3,
              borderRadius: 99, background: p.fill, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
              color: 'var(--text-2)',
            }}>
              {p.dataKey}
            </span>
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 700, color: p.fill,
          }}>
            {formatCurrency(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  )
}

function CategoryBar({ name, value, pct, color, bgDot, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      {/* Label row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 7,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* Color dot */}
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: color, flexShrink: 0,
            boxShadow: `0 0 0 2px ${color}28`,
          }} />
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: hovered ? 'var(--text)' : 'var(--text-2)',
            transition: 'color 0.18s',
          }}>
            {name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Amount — fades in on hover */}
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }}
            transition={{ duration: 0.18 }}
            style={{
              fontSize: 10, fontWeight: 700,
              color: color,
              background: `${color}14`,
              padding: '2px 7px', borderRadius: 99,
              whiteSpace: 'nowrap',
            }}
          >
            {formatCurrency(value, true)}
          </motion.span>

          {/* Percentage */}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 700,
            color: hovered ? color : 'var(--text-3)',
            transition: 'color 0.18s',
            minWidth: 34, textAlign: 'right',
          }}>
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Track + fill */}
      <div style={{
        height: 8,
        borderRadius: 99,
        background: 'var(--surface-3)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: hovered ? `0 0 8px ${color}55` : 'none',
            transition: 'box-shadow 0.22s ease',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function InsightsSection() {
  const transactions = useTransactionStore(s => s.transactions)
  const insights   = computeInsights(transactions)
  const monthly    = computeMonthlyTrend(transactions)
  const breakdown  = computeCategoryBreakdown(transactions)
  const totalExp   = breakdown.reduce((s, d) => s + d.value, 0)

  const kpis = [
    {
      icon:  Award,
      label: 'Top Category',
      value: insights.topCategory.name,
      sub:   formatCurrency(insights.topCategory.value) + ' total',
      color: '#f59e0b',
    },
    {
      icon:  TrendingDown,
      label: 'This Month Expenses',
      value: formatCurrency(insights.thisMonthExpense),
      sub:   insights.expenseChange !== 0
        ? `${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}% vs last month`
        : 'No prior data',
      color: 'var(--expense)',
    },
    {
      icon:  TrendingUp,
      label: 'This Month Income',
      value: formatCurrency(insights.thisMonthIncome),
      sub:   insights.incomeChange !== 0
        ? `${insights.incomeChange > 0 ? '+' : ''}${insights.incomeChange.toFixed(1)}% vs last month`
        : 'No prior data',
      color: 'var(--income)',
    },
    {
      icon:  PiggyBank,
      label: 'Savings Rate',
      value: insights.savingsRate.toFixed(1) + '%',
      sub:   'Income saved overall',
      color: 'var(--primary)',
    },
    {
      icon:  Activity,
      label: 'Avg Transaction',
      value: formatCurrency(insights.avgTransaction),
      sub:   `Across ${transactions.length} transactions`,
      color: '#8b5cf6',
    },
    {
      icon:  BarChart2,
      label: 'Total Transactions',
      value: transactions.length,
      sub:   `${transactions.filter(t=>t.type==='income').length} income · ${transactions.filter(t=>t.type==='expense').length} expense`,
      color: '#06b6d4',
    },
  ]

  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <KPICard key={k.label} {...k} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* Monthly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card style={{
            padding: '22px 22px 16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 className="ff-display fw-700" style={{ fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>
                  Monthly Comparison
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Income vs Expenses per month</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {[
                  { color: '#16a34a', label: 'Income'  },
                  { color: '#dc2626', label: 'Expense' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      display: 'inline-block', width: 10, height: 10,
                      borderRadius: 3, background: color,
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthly} barGap={3} barCategoryGap="28%" margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#16a34a" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.65} />
                  </linearGradient>
                  <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#dc2626" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.65} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 6"
                  stroke="var(--border)"
                  strokeOpacity={0.7}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false} tickLine={false} dy={6}
                  tick={{ fontSize: 11, fontWeight: 600, fill: 'var(--text-4)', fontFamily: 'Plus Jakarta Sans' }}
                />
                <YAxis
                  axisLine={false} tickLine={false} width={44}
                  tick={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-4)', fontFamily: 'Plus Jakarta Sans' }}
                  tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'}
                />
                <Tooltip
                  content={<MonthlyBarTooltip />}
                  cursor={{ fill: 'var(--surface-3)', opacity: 0.6, radius: 6 }}
                />
                <Bar dataKey="income"  fill="url(#incomeBarGrad)"  radius={[6,6,0,0]} maxBarSize={26} />
                <Bar dataKey="expense" fill="url(#expenseBarGrad)" radius={[6,6,0,0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Category Breakdown Bars */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%' }}
        >
          <Card style={{ padding: '22px 20px 20px', height: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <h3 className="ff-display fw-700" style={{ fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>
                Category Breakdown
              </h3>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                Share of total spending
              </p>
            </div>

            {/* Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {breakdown.slice(0, 7).map((d, i) => {
                const pct    = totalExp > 0 ? (d.value / totalExp) * 100 : 0
                const cat    = getCategoryColor(d.name)
                const color  = cat.color
                const bgDot  = cat.bg
                const delay  = 0.48 + i * 0.06

                return (
                  <CategoryBar
                    key={d.name}
                    name={d.name}
                    value={d.value}
                    pct={pct}
                    color={color}
                    bgDot={bgDot}
                    delay={delay}
                  />
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
