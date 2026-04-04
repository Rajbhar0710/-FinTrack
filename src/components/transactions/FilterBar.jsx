import { Search, X, Download, Plus, ChevronDown, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFilterStore } from '../../store/useFilterStore'
import { useUIStore } from '../../store/useUIStore'
import { CATEGORY_NAMES } from '../../utils/categoryColors'

/* ── Shared select wrapper — custom arrow, consistent sizing ─────────────── */
function FilterSelect({ value, onChange, children, minWidth = 130 }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          appearance:      'none',
          WebkitAppearance:'none',
          height:          36,
          paddingLeft:     12,
          paddingRight:    32,
          background:      'var(--surface)',
          border:          '1px solid var(--border)',
          borderRadius:    10,
          fontSize:        12,
          fontWeight:      600,
          fontFamily:      'inherit',
          color:           'var(--text-2)',
          cursor:          'pointer',
          outline:         'none',
          minWidth,
          transition:      'border-color 0.18s, box-shadow 0.18s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--primary)'
          e.target.style.boxShadow   = '0 0 0 3px rgba(5,150,105,0.10)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.boxShadow   = 'none'
        }}
        onMouseEnter={e => {
          if (document.activeElement !== e.target)
            e.target.style.borderColor = 'var(--border-2)'
        }}
        onMouseLeave={e => {
          if (document.activeElement !== e.target)
            e.target.style.borderColor = 'var(--border)'
        }}
      >
        {children}
      </select>
      {/* Custom chevron */}
      <ChevronDown
        size={13}
        strokeWidth={2.5}
        style={{
          position:       'absolute',
          right:          10,
          top:            '50%',
          transform:      'translateY(-50%)',
          color:          'var(--text-4)',
          pointerEvents:  'none',
        }}
      />
    </div>
  )
}

/* ── Type toggle pill group ──────────────────────────────────────────────── */
const TYPE_OPTIONS = [
  { id: 'all',     label: 'All'     },
  { id: 'income',  label: 'Income'  },
  { id: 'expense', label: 'Expense' },
]

const TYPE_ACTIVE_COLOR = {
  all:     { color: 'var(--text)',    bg: 'var(--surface)' },
  income:  { color: 'var(--income)',  bg: 'var(--income-light)'  },
  expense: { color: 'var(--expense)', bg: 'var(--expense-light)' },
}

export default function FilterBar({ onAdd, onExport }) {
  const {
    search, typeFilter, sortBy, category,
    setSearch, setTypeFilter, setSortBy, setCategory, reset,
  } = useFilterStore()
  const role = useUIStore(s => s.role)

  const hasFilters = search || typeFilter !== 'all' || sortBy !== 'date' || category !== 'all'

  return (
    <div
      className="card-flat"
      style={{
        padding:      '16px 18px',
        display:      'flex',
        flexDirection:'column',
        gap:          14,
        // Slightly more prominent shadow than a regular card
        boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Row 1: search + action buttons ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search — prominent, full-height, clear button */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search
            size={15}
            strokeWidth={2}
            style={{
              position:  'absolute',
              left:      13,
              top:       '50%',
              transform: 'translateY(-50%)',
              color:     'var(--text-4)',
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, category or type…"
            style={{
              width:        '100%',
              height:       40,
              paddingLeft:  40,
              paddingRight: search ? 36 : 14,
              background:   'var(--surface-2)',
              border:       '1px solid var(--border)',
              borderRadius: 12,
              fontSize:     13,
              fontWeight:   500,
              fontFamily:   'inherit',
              color:        'var(--text)',
              outline:      'none',
              transition:   'border-color 0.18s, box-shadow 0.18s, background 0.18s',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--primary)'
              e.target.style.boxShadow   = '0 0 0 3px rgba(5,150,105,0.10)'
              e.target.style.background  = 'var(--surface)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.boxShadow   = 'none'
              e.target.style.background  = 'var(--surface-2)'
            }}
          />
          {/* Clear search */}
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position:       'absolute',
                right:          10,
                top:            '50%',
                transform:      'translateY(-50%)',
                width:          20,
                height:         20,
                borderRadius:   6,
                border:         'none',
                background:     'var(--surface-3)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                cursor:         'pointer',
                color:          'var(--text-3)',
                padding:        0,
                transition:     'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-3)' }}
              aria-label="Clear search"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Divider — desktop only */}
        <div
          className="hidden sm:block"
          style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }}
        />

        {/* Export — icon nudges down on hover to imply downloading */}
        <motion.button
          onClick={onExport}
          className="btn btn-ghost"
          style={{ height: 36, fontSize: 12, gap: 6, padding: '0 14px', flexShrink: 0 }}
          whileHover="hover"
          whileTap={{ scale: 0.955 }}
        >
          <motion.span
            variants={{ hover: { y: [0, 3, 0], transition: { duration: 0.35, ease: 'easeInOut' } } }}
            style={{ display: 'flex' }}
          >
            <Download size={14} />
          </motion.span>
          Export CSV
        </motion.button>

        {/* Add (admin only) — Plus rotates 90° on hover */}
        {role === 'admin' && (
          <motion.button
            onClick={onAdd}
            className="btn btn-primary"
            style={{ height: 36, fontSize: 12, gap: 6, padding: '0 16px', flexShrink: 0 }}
            whileHover="hover"
            whileTap={{ scale: 0.955 }}
          >
            <motion.span
              variants={{ hover: { rotate: 90, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } } }}
              style={{ display: 'flex' }}
            >
              <Plus size={14} />
            </motion.span>
            Add
          </motion.button>
        )}
      </div>

      {/* ── Row 2: filters ──────────────────────────────────────────────── */}
      <div
        style={{
          display:     'flex',
          gap:         8,
          flexWrap:    'wrap',
          alignItems:  'center',
          paddingTop:  12,
          borderTop:   '1px solid var(--border)',
        }}
      >
        {/* Label */}
        <span style={{
          fontSize:   11,
          fontWeight: 700,
          color:      'var(--text-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginRight: 2,
          flexShrink: 0,
        }}>
          Filter:
        </span>

        {/* Type toggle — pill group */}
        <div style={{
          display:      'flex',
          background:   'var(--surface-3)',
          border:       '1px solid var(--border)',
          borderRadius: 10,
          padding:      2,
          gap:          2,
          flexShrink:   0,
        }}>
          {TYPE_OPTIONS.map(({ id, label }) => {
            const active = typeFilter === id
            const colors = TYPE_ACTIVE_COLOR[id]
            return (
              <button
                key={id}
                onClick={() => setTypeFilter(id)}
                style={{
                  height:       30,
                  padding:      '0 12px',
                  borderRadius: 8,
                  border:       'none',
                  fontSize:     11,
                  fontWeight:   700,
                  cursor:       'pointer',
                  transition:   'all 0.16s ease',
                  background:   active ? colors.bg    : 'transparent',
                  color:        active ? colors.color : 'var(--text-4)',
                  boxShadow:    active ? 'var(--shadow-sm)' : 'none',
                  letterSpacing:'0.02em',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Category select */}
        <FilterSelect
          value={category}
          onChange={e => setCategory(e.target.value)}
          minWidth={140}
        >
          <option value="all">All Categories</option>
          {CATEGORY_NAMES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FilterSelect>

        {/* Sort select */}
        <FilterSelect
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          minWidth={148}
        >
          <option value="date">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount: High → Low</option>
          <option value="amount-asc">Amount: Low → High</option>
        </FilterSelect>

        {/* Active filter count badge + clear */}
        {hasFilters && (() => {
          const count = [
            search,
            typeFilter !== 'all',
            sortBy !== 'date',
            category !== 'all',
          ].filter(Boolean).length

          return (
            <button
              onClick={reset}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          6,
                height:       30,
                padding:      '0 10px 0 8px',
                borderRadius: 8,
                border:       '1px solid var(--border)',
                background:   'var(--surface)',
                fontSize:     11,
                fontWeight:   600,
                color:        'var(--text-3)',
                cursor:       'pointer',
                transition:   'all 0.15s',
                flexShrink:   0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--expense)'
                e.currentTarget.style.color       = 'var(--expense)'
                e.currentTarget.style.background  = 'var(--expense-light)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color       = 'var(--text-3)'
                e.currentTarget.style.background  = 'var(--surface)'
              }}
            >
              {/* Active count dot */}
              <span style={{
                width:          16,
                height:         16,
                borderRadius:   '50%',
                background:     'var(--primary)',
                color:          '#fff',
                fontSize:       9,
                fontWeight:     800,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                {count}
              </span>
              Clear
              <X size={11} strokeWidth={2.5} />
            </button>
          )
        })()}
      </div>
    </div>
  )
}
