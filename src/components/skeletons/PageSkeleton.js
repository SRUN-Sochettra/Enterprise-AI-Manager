export default function PageSkeleton() {
  return (
    <div className="space-y-6 animate-shimmer">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-white/5 rounded-xl" />
          <div className="h-4 w-36 bg-white/3 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-white/5 rounded-full" />
          <div className="h-6 w-16 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="flex gap-2">
        {[120, 90, 110, 90, 80].map((w, i) => (
          <div
            key={i}
            className="h-10 bg-white/5 rounded-xl"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-white/5 rounded-lg" />
            <div className="h-3 w-24 bg-white/3 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-44 bg-white/5 rounded-xl" />
            <div className="h-9 w-32 bg-white/5 rounded-xl" />
          </div>
        </div>

        {/* Table header */}
        <div className="border-b border-white/5 px-5 py-3.5 flex gap-8">
          {[40, 160, 120, 100, 80, 80].map((w, i) => (
            <div key={i} className="h-3 bg-white/5 rounded" style={{ width: w }} />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="px-5 py-4 border-b border-white/3 flex items-center gap-8"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div className="h-5 w-10 bg-white/5 rounded-lg" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-xl shrink-0" />
              <div className="h-4 w-32 bg-white/5 rounded-lg" />
            </div>
            <div className="h-3 w-28 bg-white/3 rounded-lg" />
            <div className="h-5 w-20 bg-white/5 rounded-lg" />
            <div className="h-4 w-16 bg-white/5 rounded-lg" />
            <div className="h-3 w-16 bg-white/3 rounded-lg" />
          </div>
        ))}

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="h-8 w-32 bg-white/5 rounded-xl" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 bg-white/5 rounded-lg" />
            ))}
          </div>
          <div className="h-4 w-20 bg-white/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
}