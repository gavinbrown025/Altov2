export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Profile Loading */}
      <section className="bg-base-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 skeleton rounded-full"></div>
          <div className="space-y-2">
            <div className="h-8 skeleton rounded w-48"></div>
            <div className="h-4 skeleton rounded w-32"></div>
            <div className="h-4 skeleton rounded w-24"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Playlists Loading */}
        <section>
          <div className="h-8 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-12 h-12 rounded skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4 skeleton"></div>
                  <div className="h-3 rounded w-1/2 skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Tracks Loading */}
        <section>
          <div className="h-8 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-8 h-4 rounded skeleton"></div>
                <div className="w-12 h-12 rounded skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4 skeleton"></div>
                  <div className="h-3 rounded w-1/2 skeleton"></div>
                </div>
                <div className="h-3 rounded w-12 skeleton"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}