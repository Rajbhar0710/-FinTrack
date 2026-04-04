import { FileSearch } from 'lucide-react'

export default function EmptyState({ title = 'No results', message = 'Try adjusting your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--surface-3)' }}
      >
        <FileSearch size={24} style={{ color: 'var(--text-4)' }} />
      </div>
      <p className="fw-600 text-sm" style={{ color: 'var(--text-2)' }}>{title}</p>
      <p className="text-xs" style={{ color: 'var(--text-4)' }}>{message}</p>
    </div>
  )
}
