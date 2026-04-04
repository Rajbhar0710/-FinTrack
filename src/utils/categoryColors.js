/**
 * Single source of truth for category colors used across:
 *  - Pie / donut chart
 *  - Transaction row badges
 *  - Insights category bars
 *  - Legends
 *
 * color  — primary swatch (icon stroke, chart fill, text)
 * bg     — light tint for badge background (light theme)
 * bgDark — darker tint for badge background (dark theme)
 */
export const CATEGORY_COLORS = {
  // ── Required canonical mappings ────────────────────────────────────────
  Rent:          { color: '#e11d48', bg: '#ffe4e6', bgDark: 'rgba(225,29,72,0.18)'   },
  Salary:        { color: '#16a34a', bg: '#dcfce7', bgDark: 'rgba(22,163,74,0.18)'   },
  Food:          { color: '#ea580c', bg: '#ffedd5', bgDark: 'rgba(234,88,12,0.18)'   },
  Shopping:      { color: '#7c3aed', bg: '#ede9fe', bgDark: 'rgba(124,58,237,0.18)'  },
  Utilities:     { color: '#2563eb', bg: '#dbeafe', bgDark: 'rgba(37,99,235,0.18)'   },

  // ── Supporting categories ───────────────────────────────────────────────
  Transport:     { color: '#0891b2', bg: '#cffafe', bgDark: 'rgba(8,145,178,0.18)'   },
  Health:        { color: '#059669', bg: '#d1fae5', bgDark: 'rgba(5,150,105,0.18)'   },
  Entertainment: { color: '#db2777', bg: '#fce7f3', bgDark: 'rgba(219,39,119,0.18)'  },
  Freelance:     { color: '#0284c7', bg: '#e0f2fe', bgDark: 'rgba(2,132,199,0.18)'   },
  Investment:    { color: '#d97706', bg: '#fef3c7', bgDark: 'rgba(217,119,6,0.18)'   },
  Other:         { color: '#64748b', bg: '#f1f5f9', bgDark: 'rgba(100,116,139,0.18)' },
}

/**
 * Returns the color config for a category.
 * Falls back to Other if the category is unknown.
 */
export function getCategoryColor(categoryName) {
  return CATEGORY_COLORS[categoryName] ?? CATEGORY_COLORS.Other
}

/** Ordered list of category names — used for dropdowns and loops. */
export const CATEGORY_NAMES = Object.keys(CATEGORY_COLORS)
