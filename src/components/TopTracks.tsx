import { useDashboard } from "@/contexts/DashboardContext";

export default function TopTracks() {
  const { topTracks } = useDashboard();

  if (topTracks.length === 0) {
    return <p>No top tracks available.</p>;
  }
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
      <div className="space-y-3">
        {topTracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 text-center text-lg font-bold text-gray-500">
              {index + 1}
            </div>
            {track.album.images && track.album.images[0] && (
              <img
                src={track.album.images[0].url}
                alt={track.album.name}
                className="size-12 rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{track.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {Math.floor(track.duration_ms / 60000)}:
              {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(
                2,
                "0"
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
