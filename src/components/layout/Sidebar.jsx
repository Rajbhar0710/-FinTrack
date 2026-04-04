import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUIStore } from '../../store/useUIStore'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
]

export default function Sidebar({ open, onClose }) {
  const { currentPage, setPage, theme, toggleTheme, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()

  function navigate(id) {
    setPage(id)
    onClose?.()
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full z-50 lg:relative transition-all duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: sidebarCollapsed ? 68 : 240 }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 overflow-hidden"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(5,150,105,0.06) 0%, transparent 70%)',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <span className="ff-mono fw-700 text-xs text-white">F</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="ff-display fw-700 text-sm" style={{ color: 'var(--text)' }}>FinTrack</p>
              <p className="text-[10px]" style={{ color: 'var(--text-4)' }}>Personal Finance</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1" style={{ padding: sidebarCollapsed ? '16px 8px' : '16px 12px' }}>
          {!sidebarCollapsed && (
            <p className="px-2 mb-2 text-[10px] fw-700 uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>
              Menu
            </p>
          )}
          {NAV.map(({ id, label, Icon }) => {
            const active = currentPage === id
            return (
              <motion.button
                key={id}
                onClick={() => navigate(id)}
                title={sidebarCollapsed ? label : undefined}
                className={`nav-item ${active ? 'active' : ''}`}
                style={{
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '10px' : '9px 12px',
                  width: '100%',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  animate={active ? { scale: [1, 1.22, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexShrink: 0 }}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                </motion.span>
                {!sidebarCollapsed && label}
              </motion.button>
            )
          })}
        </div>

        {/* Bottom section: dark mode toggle + collapse button */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {/* Dark mode toggle */}
          <div
            className="flex items-center px-4 py-3"
            style={{
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                {theme === 'dark'
                  ? <Moon size={14} style={{ color: 'var(--text-3)' }} />
                  : <Sun  size={14} style={{ color: 'var(--text-3)' }} />}
                <span className="text-xs fw-500" style={{ color: 'var(--text-3)' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              title={sidebarCollapsed ? (theme === 'dark' ? 'Switch to Light' : 'Switch to Dark') : undefined}
              className="relative rounded-full transition-colors duration-300 flex-shrink-0"
              style={{
                width: 40, height: 20,
                background: theme === 'dark' ? 'var(--primary)' : 'var(--border-2)',
              }}
              aria-label="Toggle theme"
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                style={{ left: theme === 'dark' ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleSidebarCollapsed}
            className="hidden lg:flex items-center w-full px-4 py-3 transition-colors"
            style={{
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-4)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-4)' }}
          >
            {sidebarCollapsed
              ? <ChevronsRight size={16} strokeWidth={2} />
              : <><ChevronsLeft size={16} strokeWidth={2} /> Collapse</>
            }
          </button>
        </div>
      </aside>
    </>
  )
}
