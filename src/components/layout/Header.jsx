import { useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, Shield, Eye, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/useUIStore'

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard',    sub: 'Your financial overview' },
  transactions: { title: 'Transactions', sub: 'All your transactions'   },
  insights:     { title: 'Insights',     sub: 'Trends & analytics'      },
}

const ROLES = [
  {
    id:    'viewer',
    label: 'Viewer',
    Icon:  Eye,
    description: 'Read-only access',
    color:  '#64748b',
    bg:     'var(--surface-3)',
    activeBg:    '#f1f5f9',
    activeDark:  'rgba(100,116,139,0.18)',
    activeColor: '#334155',
  },
  {
    id:    'admin',
    label: 'Admin',
    Icon:  Shield,
    description: 'Full access',
    color:  '#059669',
    bg:     'var(--primary-light)',
    activeBg:    '#d1fae5',
    activeDark:  'rgba(5,150,105,0.18)',
    activeColor: '#065f46',
  },
]

function RoleDropdown({ role, setRole }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = ROLES.find(r => r.id === role) || ROLES[0]
  const isAdmin = role === 'admin'

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handler(e) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 10px 6px 8px',
          borderRadius: 10,
          border: `1.5px solid ${isAdmin ? 'rgba(5,150,105,0.3)' : 'var(--border)'}`,
          background: isAdmin ? 'var(--primary-light)' : 'var(--surface-2)',
          cursor: 'pointer',
          transition: 'all 0.15s',
          outline: 'none',
          userSelect: 'none',
        }}
      >
        {/* Role icon badge */}
        <span style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isAdmin ? 'rgba(5,150,105,0.2)' : 'rgba(100,116,139,0.12)',
          flexShrink: 0,
        }}>
          <current.Icon
            size={12}
            strokeWidth={2.2}
            style={{ color: isAdmin ? '#059669' : '#64748b' }}
          />
        </span>

        {/* Label */}
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.03em',
          color: isAdmin ? '#065f46' : 'var(--text-2)',
        }}>
          {current.label}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          style={{
            color: isAdmin ? '#059669' : 'var(--text-4)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            marginLeft: 1,
          }}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 210,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.7)',
              overflow: 'hidden',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '10px 14px 8px',
              borderBottom: '1px solid var(--border)',
            }}>
              <p style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-4)',
              }}>
                Switch Role
              </p>
            </div>

            {/* Options */}
            <div style={{ padding: '6px' }}>
              {ROLES.map(({ id, label, Icon, description, color, activeBg }) => {
                const isActive = role === id
                return (
                  <button
                    key={id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { setRole(id); setOpen(false) }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 9,
                      border: 'none',
                      background: isActive ? activeBg : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = 'var(--surface-2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isActive ? activeBg : 'transparent'
                    }}
                  >
                    {/* Icon */}
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${color}18`,
                      flexShrink: 0,
                    }}>
                      <Icon size={15} strokeWidth={2} style={{ color }} />
                    </span>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive ? color : 'var(--text)',
                        lineHeight: 1,
                        marginBottom: 3,
                      }}>
                        {label}
                      </p>
                      <p style={{
                        fontSize: 11,
                        color: 'var(--text-4)',
                        lineHeight: 1,
                      }}>
                        {description}
                      </p>
                    </div>

                    {/* Active checkmark */}
                    {isActive && (
                      <span style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Check size={10} strokeWidth={3} color="#fff" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer hint */}
            <div style={{
              padding: '8px 14px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface-2)',
            }}>
              <p style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.4 }}>
                {role === 'admin'
                  ? '⚡ Admin can add, edit and delete transactions.'
                  : '👁 Viewer has read-only access.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Header({ onMenuClick }) {
  const { currentPage, role, setRole } = useUIStore()
  const { title, sub } = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard

  return (
    <header
      className="flex items-center gap-4 px-5 py-4 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 0 var(--border), 0 2px 16px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Hamburger — mobile only (hidden on desktop via .mobile-only) */}
      <button
        onClick={onMenuClick}
        className="btn btn-ghost btn-icon mobile-only"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="ff-display fw-700 text-base truncate" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
        <p className="text-[11px] hidden sm:block" style={{ color: 'var(--text-4)' }}>{sub}</p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Role dropdown */}
        <RoleDropdown role={role} setRole={setRole} />
      </div>
    </header>
  )
}
