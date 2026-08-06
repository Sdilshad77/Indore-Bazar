export function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-line overflow-hidden p-3">
          <div className="skeleton aspect-square rounded-xl" />
          <div className="skeleton h-3 w-1/3 mt-3 rounded" />
          <div className="skeleton h-4 w-4/5 mt-2 rounded" />
          <div className="flex items-end justify-between mt-4">
            <div className="skeleton h-5 w-14 rounded" />
            <div className="skeleton h-8 w-16 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return <div className="skeleton h-48 md:h-64 rounded-3xl" />;
}

export function RowSkeleton() {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-44 w-40 rounded-2xl shrink-0" />
      ))}
    </div>
  );
}