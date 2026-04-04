import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      role:             'viewer',
      theme:            'light',
      currentPage:      'dashboard',
      sidebarCollapsed: false,

      setRole:    (role)        => set({ role }),
      setPage:    (currentPage) => set({ currentPage }),
      toggleSidebarCollapsed: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleTheme() {
        set(s => {
          const next = s.theme === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', next)
          return { theme: next }
        })
      },
    }),
    {
      name: 'finance-ui',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      },
    }
  )
)
