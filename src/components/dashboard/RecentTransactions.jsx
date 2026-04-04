import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useUIStore } from '../../store/useUIStore'
import { getCategoryColor } from '../../utils/categoryColors'
import { formatCurrency, formatShortDate } from '../../utils/formatters'

export default function RecentTransactions() {
  const transactions = useTransactionStore(s => s.transactions)
  const { setPage, theme } = useUIStore()
  const isDark = theme === 'dark'
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h3 className="ff-display fw-700 text-sm" style={{ color: 'var(--text)' }}>
              Recent Activity
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>Latest 5 transactions</p>
          </div>
          <button
            onClick={() => setPage('transactions')}
            className="btn btn-ghost btn-sm flex items-center gap-1"
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        {/* Rows */}
        <div>
          {recent.map(t => {
            const cat    = getCategoryColor(t.category)
            const isInc  = t.type === 'income'
            return (
              <div key={t.id} className="txn-row">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ background: isDark ? cat.bgDark : cat.bg }}
                >
                  {isInc
                    ? <ArrowDownLeft size={15} style={{ color: cat.color }} />
                    : <ArrowUpRight  size={15} style={{ color: cat.color }} />}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] fw-600 truncate" style={{ color: 'var(--text)' }}>
                    {t.description}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                    {t.category} · {formatShortDate(t.date)}
                  </p>
                </div>
                {/* Amount */}
                <p
                  className="ff-mono text-sm fw-700 flex-shrink-0"
                  style={{ color: isInc ? 'var(--income)' : 'var(--expense)' }}
                >
                  {isInc ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
