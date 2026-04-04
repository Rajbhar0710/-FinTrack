import { subDays, subMonths, format } from 'date-fns'
import { CATEGORY_COLORS } from './categoryColors'

const today = new Date(2026, 3, 4) // Apr 4 2026

function d(daysAgo) {
  return format(subDays(today, daysAgo), 'yyyy-MM-dd')
}

// Re-export so existing imports of CATEGORIES keep working unchanged
export const CATEGORIES = CATEGORY_COLORS

export const MOCK_TRANSACTIONS = [
  // April 2026
  { id: 1,  date: d(0),  description: 'Grocery Store',         category: 'Food',          type: 'expense', amount: 87.50  },
  { id: 2,  date: d(1),  description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 3,  date: d(1),  description: 'Uber Ride',             category: 'Transport',     type: 'expense', amount: 18.40  },
  { id: 4,  date: d(2),  description: 'Netflix Subscription',  category: 'Entertainment', type: 'expense', amount: 15.99  },
  { id: 5,  date: d(3),  description: 'Pharmacy',              category: 'Health',        type: 'expense', amount: 42.00  },
  { id: 6,  date: d(3),  description: 'Freelance Project',     category: 'Freelance',     type: 'income',  amount: 800.00 },
  { id: 7,  date: d(4),  description: 'Electric Bill',         category: 'Utilities',     type: 'expense', amount: 95.00  },
  { id: 8,  date: d(5),  description: 'Amazon Purchase',       category: 'Shopping',      type: 'expense', amount: 134.99 },
  { id: 9,  date: d(6),  description: 'Coffee Shop',           category: 'Food',          type: 'expense', amount: 12.50  },
  { id: 10, date: d(7),  description: 'Investment Dividend',   category: 'Investment',    type: 'income',  amount: 220.00 },
  // March 2026
  { id: 11, date: d(10), description: 'Rent Payment',          category: 'Rent',          type: 'expense', amount: 1400.00},
  { id: 12, date: d(11), description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 13, date: d(12), description: 'Supermarket',           category: 'Food',          type: 'expense', amount: 102.30 },
  { id: 14, date: d(13), description: 'Gym Membership',        category: 'Health',        type: 'expense', amount: 49.00  },
  { id: 15, date: d(14), description: 'Spotify',               category: 'Entertainment', type: 'expense', amount: 9.99   },
  { id: 16, date: d(15), description: 'Freelance Invoice',     category: 'Freelance',     type: 'income',  amount: 1200.00},
  { id: 17, date: d(16), description: 'Bus Pass',              category: 'Transport',     type: 'expense', amount: 35.00  },
  { id: 18, date: d(17), description: 'Water Bill',            category: 'Utilities',     type: 'expense', amount: 38.00  },
  { id: 19, date: d(18), description: 'Clothing Store',        category: 'Shopping',      type: 'expense', amount: 79.99  },
  { id: 20, date: d(19), description: 'Doctor Visit',          category: 'Health',        type: 'expense', amount: 120.00 },
  { id: 21, date: d(20), description: 'Restaurant',            category: 'Food',          type: 'expense', amount: 64.00  },
  { id: 22, date: d(21), description: 'Stock Dividends',       category: 'Investment',    type: 'income',  amount: 310.00 },
  // February 2026
  { id: 23, date: d(33), description: 'Rent Payment',          category: 'Rent',          type: 'expense', amount: 1400.00},
  { id: 24, date: d(34), description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 25, date: d(35), description: 'Grocery Store',         category: 'Food',          type: 'expense', amount: 91.20  },
  { id: 26, date: d(36), description: 'Movie Tickets',         category: 'Entertainment', type: 'expense', amount: 28.00  },
  { id: 27, date: d(37), description: 'Internet Bill',         category: 'Utilities',     type: 'expense', amount: 60.00  },
  { id: 28, date: d(38), description: 'Online Course',         category: 'Other',         type: 'expense', amount: 49.00  },
  { id: 29, date: d(39), description: 'Freelance Project',     category: 'Freelance',     type: 'income',  amount: 650.00 },
  { id: 30, date: d(40), description: 'Taxi',                  category: 'Transport',     type: 'expense', amount: 22.00  },
  { id: 31, date: d(41), description: 'Pharmacy',              category: 'Health',        type: 'expense', amount: 33.50  },
  { id: 32, date: d(42), description: 'Tech Gadget',           category: 'Shopping',      type: 'expense', amount: 249.00 },
  // January 2026
  { id: 33, date: d(64), description: 'Rent Payment',          category: 'Rent',          type: 'expense', amount: 1400.00},
  { id: 34, date: d(65), description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 35, date: d(66), description: 'Supermarket',           category: 'Food',          type: 'expense', amount: 115.40 },
  { id: 36, date: d(67), description: 'New Year Dinner',       category: 'Food',          type: 'expense', amount: 180.00 },
  { id: 37, date: d(68), description: 'Investment Returns',    category: 'Investment',    type: 'income',  amount: 450.00 },
  { id: 38, date: d(69), description: 'Gym Membership',        category: 'Health',        type: 'expense', amount: 49.00  },
  { id: 39, date: d(70), description: 'Electric + Water',      category: 'Utilities',     type: 'expense', amount: 130.00 },
  { id: 40, date: d(71), description: 'Clothing Sale',         category: 'Shopping',      type: 'expense', amount: 95.00  },
  // December 2025
  { id: 41, date: d(95), description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 42, date: d(96), description: 'Rent Payment',          category: 'Rent',          type: 'expense', amount: 1400.00},
  { id: 43, date: d(97), description: 'Christmas Shopping',    category: 'Shopping',      type: 'expense', amount: 380.00 },
  { id: 44, date: d(98), description: 'Holiday Dinner',        category: 'Food',          type: 'expense', amount: 220.00 },
  { id: 45, date: d(99), description: 'Freelance Bonus',       category: 'Freelance',     type: 'income',  amount: 900.00 },
  { id: 46, date: d(100),description: 'Utilities Bundle',      category: 'Utilities',     type: 'expense', amount: 145.00 },
  // November 2025
  { id: 47, date: d(125),description: 'Monthly Salary',        category: 'Salary',        type: 'income',  amount: 5200.00},
  { id: 48, date: d(126),description: 'Rent Payment',          category: 'Rent',          type: 'expense', amount: 1400.00},
  { id: 49, date: d(127),description: 'Grocery Store',         category: 'Food',          type: 'expense', amount: 98.60  },
  { id: 50, date: d(128),description: 'Concert Tickets',       category: 'Entertainment', type: 'expense', amount: 85.00  },
]
