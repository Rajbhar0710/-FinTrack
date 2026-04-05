# FinTrack - Personal Finance Dashboard

A modern, feature-rich personal finance tracking dashboard built with React 19, Vite, and TailwindCSS v4. Manage your income and expenses with beautiful visualizations, insights, and a responsive interface.

## ✨ Features

### 📊 Dashboard
- **Animated Summary Cards**: Total balance, income, and expenses with month-over-month comparisons
- **Balance Trend Chart**: Visualize your balance progression over time
- **Spending Pie Chart**: Categorized breakdown of your expenses
- **Recent Transactions**: Quick view of your latest financial activities

### 💰 Transactions Management
- **Full CRUD Operations**: Add, edit, and delete transactions seamlessly
- **Smart Filtering**: Filter by date range, category, and transaction type
- **Transaction Modal**: Intuitive form with validation and error handling
- **Persistent Storage**: Data saved to browser's localStorage

### 📈 Insights & Analytics
- **Monthly Comparisons**: Compare current vs previous month performance
- **Spending Analysis**: Identify spending patterns and trends
- **Income Tracking**: Monitor your income sources over time
- **Visual Charts**: Interactive charts powered by Recharts

### 🎨 User Experience
- **Dark/Light Themes**: Seamless theme switching with user preference persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Skeleton Loaders**: Loading states for better perceived performance

### 🛠 Technical Highlights
- **Code Splitting**: Lazy-loaded pages for optimal performance
- **Type-Safe Forms**: Transaction modal with validation
- **Reusable Components**: Modular UI component architecture
- **State Management**: Zustand stores for efficient state handling

## 🚀 Tech Stack

- **React 19** - Latest React with Concurrent Features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Zustand** - Lightweight state management
- **Framer Motion** - Animation and gesture library
- **Lucide React** - Beautiful open-source icons
- **date-fns** - Modern date utility library

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Available Pages

1. **Dashboard** (`/`) - Overview with charts and summary cards
2. **Transactions** (`/transactions`) - Full transaction management interface
3. **Insights** (`/insights`) - Detailed analytics and visualizations

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

## 🏗 Project Structure

```
FinTrack/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── transactions/     # Transaction-related components
│   │   ├── insights/         # Insights page components
│   │   ├── layout/           # Header, Sidebar, Navigation
│   │   └── ui/               # Generic UI components (Card, Modal, Toast, etc.)
│   ├── pages/                # Main page components
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   └── Insights.jsx
│   ├── store/                # Zustand state management
│   │   ├── useTransactionStore.js   # Transaction data and CRUD
│   │   ├── useUIStore.js            # Theme, page navigation
│   │   ├── useFilterStore.js        # Transaction filters
│   │   └── useToastStore.js         # Toast notifications
│   ├── utils/                # Utility functions
│   │   ├── computeInsights.js       # Financial calculations
│   │   ├── formatters.js            # Number and date formatting
│   │   ├── mockData.js              # Sample transaction data
│   │   └── categoryColors.js        # Category definitions
│   ├── assets/               # Static assets (images, icons)
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles and Tailwind directives
├── public/                   # Static files
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Color Palette & Themes

The application uses a custom color system with CSS variables for seamless theme switching:

### CSS Variables
- `--primary`: Main accent color
- `--text`: Primary text color
- `--text-2`: Secondary text color
- `--text-3`: Muted text color
- `--surface`: Main surface color
- `--surface-2`: Secondary surface color
- `--surface-3`: Tertiary surface color
- `--border`: Border color
- `--income`: Income (green) color
- `--expense`: Expense (red) color

### Theme Support
- **Light Theme**: Clean, bright interface with pastel gradients
- **Dark Theme**: Modern dark interface with subtle glows
- **Persistent**: User preference saved to localStorage

## 📊 Data Structure

### Transaction Model
```typescript
{
  id: number,              // Unique identifier
  description: string,     // Transaction description
  amount: number,          // Transaction amount (positive)
  category: string,        // Category (Food, Transport, etc.)
  type: 'income' | 'expense',  // Transaction type
  date: string            // ISO date string (YYYY-MM-DD)
}
```

### Categories
- **Income**: Salary, Freelance, Investment
- **Expenses**: Food, Transport, Shopping, Entertainment, Health, Utilities, Rent, Other

## 🎯 Key Features Deep Dive

### Animated Summary Cards
Cards use Framer Motion for smooth counting animations and hover effects. Each card displays:
- Current value with animated counting
- Month-over-month trend percentage
- Color-coded indicators (green/red) based on performance

### Transaction Management
- **Add Transaction**: Modal with form validation, category selection, and type toggle
- **Edit Transaction**: Pre-filled form for easy editing
- **Delete Transaction**: Confirmation dialog before deletion
- **Filtering**: Multi-criteria filtering with real-time updates
- **Persistence**: All changes saved to browser's localStorage

### Charts & Visualizations
- **Balance Trend**: Line chart showing balance progression over time
- **Spending Pie**: Doughnut chart with categorized expense breakdown
- **Responsive**: Charts adapt to container size changes
- **Interactive**: Hover tooltips and smooth animations

### Mobile Experience
- **Bottom Navigation**: Mobile-optimized navigation bar
- **Responsive Grid**: Adaptive layouts for different screen sizes
- **Touch-Friendly**: Appropriate touch targets and interactions
- **Collapsible Sidebar**: Mobile drawer navigation

## 🧪 Development Notes

### State Management
The application uses Zustand stores for different concerns:
- `useTransactionStore` - Manages all transaction data and CRUD operations
- `useUIStore` - Handles theme, current page, and UI preferences
- `useFilterStore` - Manages transaction filters and sorting
- `useToastStore` - Controls toast notification system

### Performance Optimizations
- **Code Splitting**: Each page is lazy-loaded as a separate chunk
- **Memoization**: Selectors and computed values are memoized
- **Animation Performance**: Framer Motion with optimized transitions
- **Data Persistence**: Efficient localStorage usage with Zustand middleware

### Mock Data
The application comes pre-loaded with 50+ realistic mock transactions spanning 6 months, making it immediately usable for demonstration purposes.

## 🎨 Customization

### Adding New Categories
1. Edit `src/utils/categoryColors.js` to add new categories and colors
2. Update category validation in `TransactionModal.jsx`
3. The new categories will automatically appear throughout the app

### Theme Customization
1. Modify CSS variables in `src/index.css`
2. Update gradient definitions in `SummaryCards.jsx`
3. Adjust chart color schemes in chart components

### Branding
1. Replace `public/favicon.svg` with your brand icon
2. Update application title in `index.html`
3. Modify default currency formatting in `src/utils/formatters.js`

## 🔮 Future Enhancements

Potential features for future development:
- [ ] CSV import/export functionality
- [ ] Budget goals and alerts
- [ ] Recurring transaction templates
- [ ] Multi-currency support
- [ ] Cloud sync capabilities
- [ ] Advanced analytics dashboard
- [ ] Investment portfolio tracking
- [ ] Receipt upload and OCR

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

**FinTrack** - Take control of your finances with style and simplicity.
