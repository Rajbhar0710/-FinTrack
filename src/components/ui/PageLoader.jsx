/**
 * PageLoader — Suspense fallback used while lazy page chunks load.
 *
 * Mirrors the card/skeleton visual language already in the app so the
 * transition from loading → loaded feels seamless rather than jarring.
 */
function SkeletonBlock({ w = '100%', h = '14px', r = '8px' }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }}
    />
  )
}

function SkeletonCard({ height = 80 }) {
  return (
    <div
      className="card p-5 space-y-3"
      // Disable the hover lift — this is a non-interactive placeholder
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex items-start justify-between">
        <SkeletonBlock w="90px" h="11px" />
        <SkeletonBlock w="36px" h="36px" r="10px" />
      </div>
      <SkeletonBlock w="140px" h="28px" r="8px" />
      <SkeletonBlock w="80px"  h="16px" r="99px" />
    </div>
  )
}

export default function PageLoader() {
  return (
    <div className="space-y-5 anim-fade-in">
      {/* Summary cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <div className="card p-5 space-y-3" style={{ pointerEvents: 'none' }}>
          <SkeletonBlock w="130px" h="14px" />
          <SkeletonBlock w="180px" h="10px" />
          <SkeletonBlock w="100%" h="200px" r="10px" />
        </div>
        <div className="card p-5 space-y-3" style={{ pointerEvents: 'none' }}>
          <SkeletonBlock w="100px" h="14px" />
          <SkeletonBlock w="140px" h="10px" />
          <div className="flex justify-center">
            <SkeletonBlock w="160px" h="160px" r="50%" />
          </div>
        </div>
      </div>

      {/* List rows */}
      <div className="card" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}
          >
            <SkeletonBlock w="36px" h="36px" r="10px" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock w="140px" h="11px" />
              <SkeletonBlock w="80px"  h="9px"  />
            </div>
            <SkeletonBlock w="68px" h="11px" />
            <SkeletonBlock w="52px" h="18px" r="99px" />
          </div>
        ))}
      </div>
    </div>
  )
}
