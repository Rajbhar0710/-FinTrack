import SummaryCards       from '../components/dashboard/SummaryCards'
import InsightHighlight   from '../components/dashboard/InsightHighlight'
import BalanceTrendChart  from '../components/dashboard/BalanceTrendChart'
import SpendingPieChart   from '../components/dashboard/SpendingPieChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <SummaryCards />
      <InsightHighlight />

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <BalanceTrendChart />
        <SpendingPieChart />
      </div>

      <RecentTransactions />
    </div>
  )
}
