import { useState, useMemo } from 'react'
import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import ConfirmDialog from '../ui/ConfirmDialog'
import FilterBar from './FilterBar'
import TransactionModal from './TransactionModal'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useFilterStore } from '../../store/useFilterStore'
import { useUIStore } from '../../store/useUIStore'
import { getCategoryColor } from '../../utils/categoryColors'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { exportToCSV } from '../../utils/computeInsights'
import { toast } from '../../store/useToastStore'

/* ── Single row ──────────────────────────────────────────────────────────── */
function TransactionRow({ t, index, isLast, isDark, isAdmin, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)

  const cat   = getCategoryColor(t.category)
  const isInc = t.type === 'income'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden', marginBottom: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 10) * 0.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            14,
        padding:        '13px 18px',
        borderBottom:   isLast ? 'none' : '1px solid var(--border)',
        background:     hovered ? 'var(--surface-2)' : 'transparent',
        // Left accent bar via inset shadow — reveals on hover
        boxShadow:      hovered
          ? `inset 3px 0 0 ${cat.color}`
          : 'inset 3px 0 0 transparent',
        transition:     'background 0.16s ease, box-shadow 0.16s ease',
        position:       'relative',
      }}
    >
      {/* ── Category icon ─────────────────────────────────────────────── */}
      <motion.div
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          width:          40,
          height:         40,
          borderRadius:   12,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          background:     isDark ? cat.bgDark : cat.bg,
        }}
      >
        {isInc
          ? <ArrowDownLeft size={16} style={{ color: cat.color }} />
          : <ArrowUpRight  size={16} style={{ color: cat.color }} />}
      </motion.div>

      {/* ── Description + meta ────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize:   13,
          fontWeight: 600,
          color:      'var(--text)',
          whiteSpace: 'nowrap',
          overflow:   'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
          marginBottom: 3,
        }}>
          {t.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
            {formatDate(t.date)}
          </span>
          <span style={{
            width: 3, height: 3, borderRadius: '50%',
            background: 'var(--border-2)', flexShrink: 0,
          }} />
          <span style={{
            display:      'inline-flex',
            alignItems:   'center',
            padding:      '1px 7px',
            borderRadius: 99,
            fontSize:     10,
            fontWeight:   700,
            letterSpacing:'0.04em',
            background:   isDark ? cat.bgDark : cat.bg,
            color:        cat.color,
          }}>
            {t.category}
          </span>
        </div>
      </div>

      {/* ── Amount ────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <p style={{
          fontFamily:   "'JetBrains Mono', monospace",
          fontSize:     14,
          fontWeight:   800,
          letterSpacing:'-0.01em',
          color:        isInc ? 'var(--income)' : 'var(--expense)',
          // Pill background makes the amount pop without bold styling alone
          display:      'inline-block',
          padding:      '3px 9px',
          borderRadius: 8,
          background:   hovered
            ? isInc ? 'var(--income-light)' : 'var(--expense-light)'
            : 'transparent',
          transition:   'background 0.16s ease',
        }}>
          {isInc ? '+' : '−'}{formatCurrency(t.amount)}
        </p>
      </div>

      {/* ── Type badge ────────────────────────────────────────────────── */}
      <div className="hidden sm:block" style={{ flexShrink: 0 }}>
        <Badge type={t.type}>{t.type}</Badge>
      </div>

      {/* ── Admin actions — fade in on hover ──────────────────────────── */}
      {isAdmin && (
        <motion.div
          className="txn-actions"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          4,
            flexShrink:   0,
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          <button
            onClick={() => onEdit(t)}
            title="Edit"
            style={{
              width:          30,
              height:         30,
              borderRadius:   8,
              border:         '1px solid var(--border)',
              background:     'var(--surface)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              color:          'var(--text-3)',
              padding:        0,
              transition:     'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.color       = 'var(--primary)'
              e.currentTarget.style.background  = 'var(--primary-light)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color       = 'var(--text-3)'
              e.currentTarget.style.background  = 'var(--surface)'
            }}
          >
            <Pencil size={12} strokeWidth={2} />
          </button>

          <button
            onClick={() => onDelete(t.id)}
            title="Delete"
            style={{
              width:          30,
              height:         30,
              borderRadius:   8,
              border:         '1px solid var(--border)',
              background:     'var(--surface)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              color:          'var(--text-3)',
              padding:        0,
              transition:     'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--expense)'
              e.currentTarget.style.color       = 'var(--expense)'
              e.currentTarget.style.background  = 'var(--expense-light)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color       = 'var(--text-3)'
              e.currentTarget.style.background  = 'var(--surface)'
            }}
          >
            <Trash2 size={12} strokeWidth={2} />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ── Table header ────────────────────────────────────────────────────────── */
function TableHeader({ count }) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '12px 18px',
      borderBottom:   '1px solid var(--border)',
      background:     'var(--surface-2)',
      borderRadius:   '16px 16px 0 0',
    }}>
      {/* Column labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
        {/* Spacer for icon column */}
        <div style={{ width: 40, flexShrink: 0 }} />
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-4)',
        }}>
          Transaction
        </span>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-4)',
        marginRight: 'auto', paddingLeft: 14,
      }}>
        {count} result{count !== 1 ? 's' : ''}
      </span>
      <div style={{ display: 'flex', gap: 48 }}>
        <span className="hidden sm:block" style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-4)',
        }}>Amount</span>
        <span className="hidden sm:block" style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-4)',
        }}>Type</span>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function TransactionTable() {
  const transactions      = useTransactionStore(s => s.transactions)
  const deleteTransaction = useTransactionStore(s => s.deleteTransaction)
  const { search, typeFilter, sortBy, category } = useFilterStore()
  const { role, theme } = useUIStore()
  const isDark  = theme === 'dark'
  const isAdmin = role === 'admin'

  const [modalOpen,       setModalOpen]       = useState(false)
  const [editData,        setEditData]         = useState(null)
  const [confirmOpen,     setConfirmOpen]      = useState(false)
  const [pendingDeleteId, setPendingDeleteId]  = useState(null)

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter)
    if (category   !== 'all') list = list.filter(t => t.category === category)
    list.sort((a, b) => {
      if (sortBy === 'date')        return b.date.localeCompare(a.date)
      if (sortBy === 'date-asc')    return a.date.localeCompare(b.date)
      if (sortBy === 'amount-desc') return b.amount - a.amount
      if (sortBy === 'amount-asc')  return a.amount - b.amount
      return 0
    })
    return list
  }, [transactions, search, typeFilter, sortBy, category])

  function openAdd()   { setEditData(null); setModalOpen(true) }
  function openEdit(t) { setEditData(t);    setModalOpen(true) }

  function requestDelete(id) { setPendingDeleteId(id); setConfirmOpen(true) }
  function doDelete() {
    deleteTransaction(pendingDeleteId)
    toast.success('Transaction deleted.')
    setPendingDeleteId(null)
  }

  return (
    <>
      <div className="space-y-4">
        <FilterBar
          onAdd={openAdd}
          onExport={() => exportToCSV(filtered)}
        />

        <Card style={{ overflow: 'hidden', padding: 0 }}>
          <TableHeader count={filtered.length} />

          {filtered.length === 0 ? (
            <EmptyState
              title="No transactions found"
              message="Try adjusting your search or filters."
            />
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((t, i) => (
                <TransactionRow
                  key={t.id}
                  t={t}
                  index={i}
                  isLast={i === filtered.length - 1}
                  isDark={isDark}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={requestDelete}
                />
              ))}
            </AnimatePresence>
          )}
        </Card>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title="Delete transaction?"
        message="This transaction will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </>
  )
}
