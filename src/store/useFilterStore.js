import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  search:     '',
  typeFilter: 'all',   // 'all' | 'income' | 'expense'
  sortBy:     'date',  // 'date' | 'amount-asc' | 'amount-desc'
  category:   'all',

  setSearch:     (search)     => set({ search }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSortBy:     (sortBy)     => set({ sortBy }),
  setCategory:   (category)   => set({ category }),

  reset() {
    set({ search: '', typeFilter: 'all', sortBy: 'date', category: 'all' })
  },
}))
