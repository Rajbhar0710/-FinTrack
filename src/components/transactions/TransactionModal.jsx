import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { useTransactionStore } from '../../store/useTransactionStore'
import { CATEGORY_NAMES } from '../../utils/categoryColors'
import { toast } from '../../store/useToastStore'

const EMPTY = { description: '', amount: '', category: 'Food', type: 'expense', date: '' }

export default function TransactionModal({ open, onClose, editData = null }) {
  const [form, setForm]   = useState(EMPTY)
  const [error, setError] = useState('')
  const { addTransaction, editTransaction } = useTransactionStore()

  useEffect(() => {
    if (open) {
      setForm(editData
        ? { ...editData, amount: String(editData.amount) }
        : { ...EMPTY, date: new Date().toISOString().slice(0, 10) }
      )
      setError('')
    }
  }, [open, editData])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.description.trim()) return setError('Description is required.')
    const amt = parseFloat(form.amount)
    if (!amt || amt <= 0) return setError('Enter a valid positive amount.')
    if (!form.date) return setError('Select a date.')

    const payload = { ...form, amount: amt }
    if (editData) {
      editTransaction(editData.id, payload)
      toast.success('Transaction updated.')
    } else {
      addTransaction(payload)
      toast.success('Transaction added successfully.')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div>
          <label className="input-label">Type</label>
          <div
            className="flex rounded-xl p-0.5 gap-0.5"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
          >
            {['expense', 'income'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className="flex-1 py-2 rounded-lg text-xs fw-700 uppercase tracking-wide transition-all duration-200"
                style={{
                  background: form.type === t
                    ? t === 'income' ? 'var(--income)' : 'var(--expense)'
                    : 'transparent',
                  color: form.type === t ? '#fff' : 'var(--text-3)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="input-label">Description</label>
          <input
            className="input"
            placeholder="e.g. Grocery Store"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="input-label">Amount (USD)</label>
          <input
            className="input"
            type="number" min="0.01" step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <label className="input-label">Date</label>
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="input-label">Category</label>
          <select
            className="input"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORY_NAMES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs fw-600 px-1" style={{ color: 'var(--expense)' }}>{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            {editData ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
