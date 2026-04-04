import { motion } from 'framer-motion'
import {
  TrendingDown, TrendingUp, AlertTriangle,
  PiggyBank, Flame, CheckCircle2
} from 'lucide-react'
import { useTransactionStore } from '../../store/useTransactionStore'
import {
  computeInsights,
  computeCategoryBreakdown,
} from '../../utils/computeInsights'
import { getCategoryColor } from '../../utils/categoryColors'
import { formatCurrency } from '../../utils/formatters'
import { parseISO, getMonth, getYear, subMonths } from 'date-fns'

const today = new Date(2026, 3, 4)

/** Pick the single most relevant insight from available data. */
function deriveInsight(transactions) {
  const insights  = computeInsights(transactions)
  const breakdown = computeCategoryBreakdown(transactions)

  // This-month expenses by category
  const thisMonth = subMonths(today, 0)
  const thisMonthExpenses = transactions.filter(t => {
    const p = parseISO(t.date)
    return (
      t.type === 'expense' &&
      getMonth(p) === getMonth(thisMonth) &&
      getYear(p)  === getYear(thisMonth)
    )
  })
  const thisMonthTotal = thisMonthExpenses.reduce((s, t) => s + t.amount, 0)

  // Top category this month
  const catMap = {}
  thisMonthExpenses.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount
  })
  const topThisMonth = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]

  // ── Priority-ordered insight rules ──────────────────────────────────────

  // 1. Expense spike > 20% month-over-month
  if (insights.expenseChange > 20) {
    return {
      Icon:    AlertTriangle,
      accent:  '#dc2626',
      bg:      'rgba(220,38,38,0.08)',
      border:  'rgba(220,38,38,0.18)',
      label:   'Spending Alert',
      message: `Your spending is up ${insights.expenseChange.toFixed(0)}% compared to last month.`,
      sub:     `${formatCurrency(insights.thisMonthExpense)} spent this month vs ${formatCurrency(insights.lastMonthExpense)} last month.`,
    }
  }

  // 2. Single category dominates > 50% of this month's spend
  if (topThisMonth && thisMonthTotal > 0) {
    const pct = (topThisMonth[1] / thisMonthTotal) * 100
    if (pct >= 50) {
      const color = getCategoryColor(topThisMonth[0]).color
      return {
        Icon:    Flame,
        accent:  color,
        bg:      `${color}14`,
        border:  `${color}28`,
        label:   'Top Spending',
        message: `You spent ${pct.toFixed(0)}% on ${topThisMonth[0]} this month.`,
        sub:     `${formatCurrency(topThisMonth[1])} out of ${formatCurrency(thisMonthTotal)} total.`,
      }
    }
  }

  // 3. Good savings rate (≥ 30%)
  if (insights.savingsRate >= 30) {
    return {
      Icon:    PiggyBank,
      accent:  '#059669',
      bg:      'rgba(5,150,105,0.08)',
      border:  'rgba(5,150,105,0.18)',
      label:   'Great Savings',
      message: `You're saving ${insights.savingsRate.toFixed(0)}% of your income.`,
      sub:     'Keep it up — you\'re ahead of the 20% benchmark.',
    }
  }

  // 4. Income up vs last month
  if (insights.incomeChange > 5) {
    return {
      Icon:    TrendingUp,
      accent:  '#16a34a',
      bg:      'rgba(22,163,74,0.08)',
      border:  'rgba(22,163,74,0.18)',
      label:   'Income Up',
      message: `Your income grew ${insights.incomeChange.toFixed(0)}% this month.`,
      sub:     `${formatCurrency(insights.thisMonthIncome)} earned vs ${formatCurrency(insights.lastMonthIncome)} last month.`,
    }
  }

  // 5. Expense drop — good discipline
  if (insights.expenseChange < -5) {
    return {
      Icon:    CheckCircle2,
      accent:  '#059669',
      bg:      'rgba(5,150,105,0.08)',
      border:  'rgba(5,150,105,0.18)',
      label:   'Spending Down',
      message: `Expenses dropped ${Math.abs(insights.expenseChange).toFixed(0)}% vs last month.`,
      sub:     'Good discipline — you\'re spending less than before.',
    }
  }

  // 6. Fallback — all-time top category
  const top = breakdown[0]
  if (top) {
    const totalExp  = breakdown.reduce((s, d) => s + d.value, 0)
    const pct       = totalExp > 0 ? (top.value / totalExp) * 100 : 0
    const color     = getCategoryColor(top.name).color
    return {
      Icon:    TrendingDown,
      accent:  color,
      bg:      `${color}14`,
      border:  `${color}28`,
      label:   'Highest Category',
      message: `${top.name} is your biggest expense at ${pct.toFixed(0)}% of total.`,
      sub:     `${formatCurrency(top.value)} spent across all time.`,
    }
  }

  return null
}

export default function InsightHighlight() {
  const transactions = useTransactionStore(s => s.transactions)
  const insight      = deriveInsight(transactions)

  if (!insight) return null

  const { Icon, accent, bg, border, label, message, sub } = insight

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display:      'flex',
        alignItems:   'flex-start',
        gap:          14,
        padding:      '16px 18px',
        borderRadius: 16,
        background:   bg,
        border:       `1px solid ${border}`,
        // No card lift here — it's an informational strip, not a clickable surface
        transition:   'opacity 0.2s',
      }}
    >
      {/* Icon */}
      <span style={{
        width:          38,
        height:         38,
        borderRadius:   11,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     `${accent}1a`,
        flexShrink:     0,
        marginTop:      1,
      }}>
        <Icon size={18} strokeWidth={2} style={{ color: accent }} />
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label pill */}
        <span style={{
          display:       'inline-block',
          fontSize:       10,
          fontWeight:     700,
          textTransform:  'uppercase',
          letterSpacing:  '0.1em',
          color:          accent,
          marginBottom:   5,
          lineHeight:     1,
        }}>
          {label}
        </span>

        {/* Main message */}
        <p style={{
          fontSize:   13,
          fontWeight: 600,
          color:      'var(--text)',
          lineHeight: 1.4,
          margin:     0,
        }}>
          {message}
        </p>

        {/* Sub-line */}
        <p style={{
          fontSize:   11,
          fontWeight: 500,
          color:      'var(--text-4)',
          marginTop:  4,
          lineHeight: 1.4,
        }}>
          {sub}
        </p>
      </div>
    </motion.div>
  )
}
