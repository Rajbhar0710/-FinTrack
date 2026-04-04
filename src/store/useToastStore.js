import { create } from 'zustand'

let uid = 0

export const useToastStore = create((set) => ({
  toasts: [],

  // type: 'success' | 'error' | 'info'
  addToast(message, type = 'success') {
    const id = ++uid
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    // Auto-dismiss after 3.5 s
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 3500)
  },

  removeToast(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },
}))

// Convenience helpers — call these anywhere without a hook
export const toast = {
  success: (msg) => useToastStore.getState().addToast(msg, 'success'),
  error:   (msg) => useToastStore.getState().addToast(msg, 'error'),
  info:    (msg) => useToastStore.getState().addToast(msg, 'info'),
}
