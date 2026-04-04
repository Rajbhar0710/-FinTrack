import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/useToastStore'

const CONFIG = {
  success: {
    Icon:   CheckCircle2,
    color:  '#16a34a',
    border: 'rgba(22,163,74,0.22)',
    bar:    '#16a34a',
  },
  error: {
    Icon:   XCircle,
    color:  '#dc2626',
    border: 'rgba(220,38,38,0.22)',
    bar:    '#dc2626',
  },
  info: {
    Icon:   Info,
    color:  '#2563eb',
    border: 'rgba(37,99,235,0.20)',
    bar:    '#2563eb',
  },
}

function Toast({ id, message, type }) {
  const removeToast = useToastStore(s => s.removeToast)
  const cfg = CONFIG[type] || CONFIG.success

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 8,  scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="status"
      style={{
        position:       'relative',
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        padding:        '11px 14px 11px 12px',
        borderRadius:   12,
        background:     'var(--surface)',
        border:         `1px solid ${cfg.border}`,
        boxShadow:      '0 6px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        minWidth:       240,
        maxWidth:       320,
        overflow:       'hidden',
      }}
    >
      {/* Left accent bar */}
      <span style={{
        position:     'absolute',
        left: 0, top: 0, bottom: 0,
        width:        3,
        background:   cfg.bar,
        borderRadius: '12px 0 0 12px',
      }} />

      {/* Icon */}
      <cfg.Icon size={17} strokeWidth={2.2} style={{ color: cfg.color, flexShrink: 0 }} />

      {/* Message */}
      <span style={{
        flex: 1, fontSize: 13, fontWeight: 600,
        color: 'var(--text)', lineHeight: 1.35,
      }}>
        {message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: 6,
          border: 'none', background: 'transparent',
          cursor: 'pointer', color: 'var(--text-4)',
          flexShrink: 0, padding: 0,
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--surface-3)'
          e.currentTarget.style.color = 'var(--text)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-4)'
        }}
      >
        <X size={13} strokeWidth={2.5} />
      </button>

      {/* Shrinking progress bar */}
      <motion.span
        style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 2, background: cfg.bar, opacity: 0.35,
          borderRadius: '0 0 12px 12px',
        }}
        initial={{ width: '100%' }}
        animate={{ width: '0%'   }}
        transition={{ duration: 3.5, ease: 'linear' }}
      />
    </motion.div>
  )
}

export default function ToastStack() {
  const toasts = useToastStore(s => s.toasts)

  return (
    // .toast-stack class positions above bottom-nav on mobile, 24px on desktop (CSS below)
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false} mode="sync">
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </AnimatePresence>
    </div>
  )
}
