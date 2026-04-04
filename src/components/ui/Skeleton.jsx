function Sk({ w = '100%', h = '12px', r = '8px' }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />
}

export function SummaryCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <Sk w="80px" h="12px" />
        <Sk w="32px" h="32px" r="10px" />
      </div>
      <Sk w="130px" h="32px" r="8px" />
      <Sk w="90px" h="18px" r="99px" />
    </div>
  )
}

export function ChartSkeleton({ height = 220 }) {
  return (
    <div className="card p-5 space-y-2">
      <Sk w="130px" h="14px" />
      <Sk w="180px" h="10px" />
      <div style={{ height: 16 }} />
      <Sk w="100%" h={`${height}px`} r="10px" />
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="txn-row">
      <Sk w="38px" h="38px" r="10px" />
      <div className="flex-1 space-y-1.5">
        <Sk w="140px" h="12px" />
        <Sk w="80px" h="10px" />
      </div>
      <Sk w="70px" h="12px" />
      <Sk w="56px" h="20px" r="99px" />
    </div>
  )
}
