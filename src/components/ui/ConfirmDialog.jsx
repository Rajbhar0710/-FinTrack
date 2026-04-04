import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

/**
 * Reusable confirmation dialog.
 *
 * Props:
 *   open        boolean
 *   onClose     () => void
 *   onConfirm   () => void
 *   title       string
 *   message     string
 *   confirmLabel string  (default "Delete")
 *   danger      boolean  (default true — red confirm button)
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title        = 'Are you sure?',
  message      = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  danger       = true,
}) {
  function handleConfirm() {
    onConfirm()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="">
      {/* Hide the default header — render our own centered layout */}
      <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
        {/* Warning icon */}
        <div style={{
          width:          52,
          height:         52,
          borderRadius:   16,
          background:     danger ? 'rgba(220,38,38,0.10)' : 'rgba(37,99,235,0.10)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          margin:         '0 auto 16px',
        }}>
          <AlertTriangle
            size={24}
            strokeWidth={2}
            style={{ color: danger ? 'var(--expense)' : 'var(--primary)' }}
          />
        </div>

        {/* Title */}
        <p style={{
          fontFamily:  "'Space Grotesk', sans-serif",
          fontSize:    16,
          fontWeight:  700,
          color:       'var(--text)',
          marginBottom: 8,
        }}>
          {title}
        </p>

        {/* Message */}
        <p style={{
          fontSize:    13,
          color:       'var(--text-3)',
          lineHeight:  1.5,
          marginBottom: 24,
          maxWidth:    280,
          margin:      '0 auto 24px',
        }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            style={{ flex: 1 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
