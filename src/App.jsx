import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar    from './components/layout/Sidebar'
import Header     from './components/layout/Header'
import ToastStack from './components/ui/ToastStack'
import PageLoader from './components/ui/PageLoader'
import { useUIStore } from './store/useUIStore'

// Each page is a separate chunk — only downloaded on first visit
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Insights     = lazy(() => import('./pages/Insights'))

const PAGE_MAP = {
  dashboard:    Dashboard,
  transactions: Transactions,
  insights:     Insights,
}

export default function App() {
  const { currentPage, theme } = useUIStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Apply persisted theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const PageComponent = PAGE_MAP[currentPage] || Dashboard

  return (
    <div
      className="flex h-screen overflow-hidden"
    >
      {/* Single sidebar — handles both desktop (static) and mobile (drawer) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(o => !o)} />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-5"
        >
          <div className="max-w-6xl mx-auto">
            {/*
              Suspense catches the lazy chunk loading.
              PageLoader is the fallback — shown only on the very first
              visit to each page tab while the JS chunk fetches.
              Subsequent visits hit the module cache instantly.
            */}
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <PageComponent />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>

      <ToastStack />
    </div>
  )
}
