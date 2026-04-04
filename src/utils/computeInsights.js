import { parseISO, getMonth, getYear, subMonths } from 'date-fns'

const today = new Date()

export function computeSummary(transactions) {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return {
    totalIncome:   income,
    totalExpenses: expense,
    totalBalance:  income - expense,
  }
}

export function computeMonthlyTrend(transactions) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(today, 5 - i)
    return { month: d, label: d.toLocaleString('default', { month: 'short' }), year: getYear(d), m: getMonth(d) }
  })

  return months.map(({ label, year, m }) => {
    const txns = transactions.filter(t => {
      const p = parseISO(t.date)
      return getMonth(p) === m && getYear(p) === year
    })
    const income  = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { label, income, expense, balance: income - expense }
  })
}

export function computeCategoryBreakdown(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const map = {}
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount
  })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function computeInsights(transactions) {
  const thisMonth = subMonths(today, 0)
  const lastMonth = subMonths(today, 1)

  const inMonth = (t, d) => {
    const p = parseISO(t.date)
    return getMonth(p) === getMonth(d) && getYear(p) === getYear(d)
  }

  const thisMonthTxns = transactions.filter(t => inMonth(t, thisMonth))
  const lastMonthTxns = transactions.filter(t => inMonth(t, lastMonth))

  const thisExpense = thisMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const lastExpense = lastMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const thisIncome  = thisMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const lastIncome  = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  const breakdown = computeCategoryBreakdown(transactions)
  const topCategory = breakdown[0] || { name: '—', value: 0 }

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const savingsRate  = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  const expenseChange = lastExpense > 0 ? ((thisExpense - lastExpense) / lastExpense) * 100 : 0
  const incomeChange  = lastIncome  > 0 ? ((thisIncome  - lastIncome)  / lastIncome)  * 100 : 0

  return {
    topCategory,
    thisMonthExpense: thisExpense,
    lastMonthExpense: lastExpense,
    thisMonthIncome:  thisIncome,
    lastMonthIncome:  lastIncome,
    expenseChange,
    incomeChange,
    savingsRate,
    avgTransaction: transactions.length
      ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length
      : 0,
  }
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map(t => [
    t.date, t.description, t.category, t.type, t.amount.toFixed(2)
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}
