import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/useUIStore'

const NAV = [
  { id: 'dashboard',    label: 'Overview',     Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
]

export default function BottomNav() {
  const { currentPage, setPage } = useUIStore()

  return (
    <nav
      className="bottom-nav lg:hidden"
      style={{ paddingTop: 6, paddingBottom: 10 }}
    >
      {NAV.map(({ id, label, Icon }) => {
        const active = currentPage === id

        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="bottom-nav-item"
            style={{
              color: active ? 'var(--primary)' : 'var(--text-4)',
              gap: 0,
              paddingTop: 0,
              paddingBottom: 0,
              position: 'relative',
            }}
            aria-current={active ? 'page' : undefined}
          >
            {/* Sliding pill indicator — rendered once, positioned under active tab */}
            {active && (
              <motion.span
                layoutId="bottom-nav-pill"
                style={{
                  position:     'absolute',
                  top:          0,
                  left:         '50%',
                  x:            '-50%',
                  width:        40,
                  height:       3,
                  borderRadius: '0 0 4px 4px',
                  background:   'var(--primary)',
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}

            {/* Icon container */}
            <motion.span
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          44,
                height:         36,
                borderRadius:   12,
                background:     active ? 'var(--primary-light)' : 'transparent',
                marginBottom:   3,
                transition:     'background 0.2s ease',
              }}
              animate={active ? { scale: [1, 0.86, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon
                size={active ? 20 : 18}
                strokeWidth={active ? 2.2 : 1.8}
                style={{ transition: 'all 0.2s ease' }}
              />
            </motion.span>

            {/* Label — always present for layout stability, fades + shifts for active */}
            <motion.span
              animate={{
                opacity:  active ? 1    : 0.55,
                y:        active ? 0    : 1,
                fontSize: active ? '10px' : '10px',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                fontWeight:    active ? 700 : 500,
                lineHeight:    1,
                letterSpacing: active ? '0.04em' : '0.02em',
                color:         active ? 'var(--primary)' : 'var(--text-4)',
                transition:    'font-weight 0s, color 0.2s ease',
              }}
            >
              {label}
            </motion.span>
          </button>
        )
      })}
    </nav>
  )
}
