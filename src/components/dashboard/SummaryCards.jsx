import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useUIStore } from '../../store/useUIStore'
import { computeSummary, computeInsights } from '../../utils/computeInsights'
import { formatCurrency } from '../../utils/formatters'

/* Counts from 0 → target whenever `value` changes. */
function AnimatedCurrency({ value, sign }) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, v => `${sign || ''}${formatCurrency(Math.round(v))}`)

  useEffect(() => {
    const ctrl = animate(mv, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    })
    return ctrl.stop
  }, [value])    // eslint-disable-line react-hooks/exhaustive-deps

  return <motion.span>{display}</motion.span>
}

export default function SummaryCards() {
  const transactions = useTransactionStore(s => s.transactions)
  const theme    = useUIStore(s => s.theme)
  const isDark   = theme === 'dark'
  const summary  = computeSummary(transactions)
  const insights = computeInsights(transactions)

  // Derive balance change: (thisIncome - thisExpense) vs (lastIncome - lastExpense)
  const thisBalance = insights.thisMonthIncome  - insights.thisMonthExpense
  const lastBalance = insights.lastMonthIncome  - insights.lastMonthExpense
  const balanceChange = lastBalance !== 0 ? ((thisBalance - lastBalance) / Math.abs(lastBalance)) * 100 : 0

  const CARDS = [
    {
      key:    'totalBalance',
      label:  'Total Balance',
      Icon:   Wallet,
      // Emerald gradient
      gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.10) 100%)',
      accentColor: 'var(--primary)',
      iconBg: 'rgba(5,150,105,0.15)',
      sign:   null,
      trend:  balanceChange,
      trendLabel: 'vs last month',
    },
    {
      key:    'totalIncome',
      label:  'Total Income',
      Icon:   TrendingUp,
      gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.08) 100%)',
      accentColor: 'var(--income)',
      iconBg: 'rgba(22,163,74,0.15)',
      sign:   '+',
      trend:  insights.incomeChange,
      trendLabel: 'vs last month',
    },
    {
      key:    'totalExpenses',
      label:  'Total Expenses',
      Icon:   TrendingDown,
      gradient: 'linear-gradient(135deg, #fff7f7 0%, #fee2e2 60%, #fecaca 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(248,113,113,0.15) 0%, rgba(220,38,38,0.08) 100%)',
      accentColor: 'var(--expense)',
      iconBg: 'rgba(220,38,38,0.13)',
      sign:   '-',
      // For expenses, negative change = good (spending less)
      trend:  insights.expenseChange,
      trendLabel: 'vs last month',
      invertTrend: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map(({ key, label, Icon, gradient, gradientDark, accentColor, iconBg, sign, trend, trendLabel, invertTrend }, i) => {
        // Determine trend direction display
        const trendUp   = trend > 0
        const trendNone = trend === 0
        // For expenses: up is bad (red), down is good (green). For others: up is good.
        const trendGood = invertTrend ? !trendUp : trendUp
        const TrendIcon = trendNone ? Minus : trendUp ? ArrowUpRight : ArrowDownRight

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.11)' }}
            style={{
              background: isDark ? gradientDark : gradient,
              borderRadius: 18,
              border: `1px solid ${accentColor}22`,
              padding: '22px 22px 18px',
              cursor: 'default',
              transition: 'box-shadow 0.22s, transform 0.22s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle decorative ring — top-right corner */}
            <span style={{
              position: 'absolute',
              top: -28, right: -28,
              width: 100, height: 100,
              borderRadius: '50%',
              border: `20px solid ${accentColor}`,
              opacity: 0.07,
              pointerEvents: 'none',
            }} />

            {/* Top row: label + icon */}
            <div className="flex items-start justify-between mb-4">
              <p
                className="text-[11px] fw-700 uppercase tracking-widest"
                style={{ color: accentColor, opacity: 0.85 }}
              >
                {label}
              </p>
              <span
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg, backdropFilter: 'blur(4px)' }}
              >
                <Icon size={18} style={{ color: accentColor }} strokeWidth={2} />
              </span>
            </div>

            {/* Amount — counts up on mount/value change */}
            <p
              className="ff-display fw-800 leading-none mb-3"
              style={{ color: 'var(--text)', fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)' }}
            >
              <AnimatedCurrency value={summary[key]} sign={sign} />
            </p>

            {/* Trend indicator */}
            <div className="flex items-center gap-1.5">
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] fw-700"
                style={{
                  background: trendNone
                    ? 'rgba(100,116,139,0.12)'
                    : trendGood
                      ? 'rgba(22,163,74,0.13)'
                      : 'rgba(220,38,38,0.12)',
                  color: trendNone
                    ? 'var(--text-3)'
                    : trendGood
                      ? 'var(--income)'
                      : 'var(--expense)',
                }}
              >
                <TrendIcon size={11} strokeWidth={2.5} />
                {trendNone ? '0%' : `${Math.abs(trend).toFixed(1)}%`}
              </span>
              <span className="text-[11px] fw-500" style={{ color: 'var(--text-3)' }}>
                {trendLabel}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
