import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction(txn) {
        const newTxn = { ...txn, id: nextId++ }
        set(s => ({ transactions: [newTxn, ...s.transactions] }))
      },

      editTransaction(id, updates) {
        set(s => ({
          transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
        }))
      },

      deleteTransaction(id) {
        set(s => ({ transactions: s.transactions.filter(t => t.id !== id) }))
      },
    }),
    {
      name: 'finance-transactions',
      onRehydrateStorage: () => (state) => {
        if (state?.transactions?.length) {
          nextId = Math.max(...state.transactions.map(t => t.id)) + 1
        }
      },
    }
  )
)
