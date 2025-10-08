"use client";

import { useQueue } from "@/contexts/QueueContext";
import TrackListItem from "./TrackListIem";

const TrackLoading = () => (
  <div className="flex items-center space-x-3 p-3">
    <div className="w-12 h-12 rounded skeleton"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 rounded w-3/4 skeleton"></div>
      <div className="h-3 rounded w-1/2 skeleton"></div>
    </div>
  </div>
);

export default function Queue() {
  const { currentTrack, loading, queue, error } = useQueue();

  if (error) return <p>Error: {error}</p>;
  if (queue.length === 0) return <p>No active playback.</p>;

  return (
    <section className="space-y-6">
      {/* Show currently playing track */}
      {currentTrack && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Now Playing</h3>
          {loading ? (
            <TrackLoading />
          ) : (
            <TrackListItem track={currentTrack} isCurrentTrack={true} />
          )}
        </div>
      )}

      {/* Show upcoming queue */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Up Next</h3>
        <div className="space-y-3">
          {queue.map((track, index) => (
            <TrackListItem
              key={`queue-${index}`}
              track={track}
              isCurrentTrack={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
