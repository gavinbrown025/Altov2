import React from "react";
import { useQueue } from "@/contexts/QueueContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { useSearch } from "@/contexts/SearchContext";

export default function QueueDemo() {
  const { playTracks, addToQueue } = useQueue();
  const { topTracks } = useDashboard();
  const { results } = useSearch();

  const handlePlayTopTracks = () => {
    if (topTracks.length > 0) {
      playTracks(topTracks.slice(0, 5)); // Play first 5 top tracks
    }
  };

  const handleAddSearchResult = (index: number) => {
    if (results[index]) {
      addToQueue(results[index]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <button
          onClick={handlePlayTopTracks}
          className="btn btn-primary mr-2"
          disabled={topTracks.length === 0}
        >
          Play Top 5 Tracks
        </button>
        <span className="text-sm opacity-70">
          {topTracks.length > 0 ? `${topTracks.length} top tracks available` : 'Loading top tracks...'}
        </span>
      </div>

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Add from Search Results:</h3>
          <div className="space-y-2">
            {results.slice(0, 3).map((track, index) => (
              <div key={track.id} className="flex items-center justify-between p-2 bg-base-200 rounded">
                <div>
                  <div className="font-medium">{track.name}</div>
                  <div className="text-sm opacity-70">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => handleAddSearchResult(index)}
                  className="btn btn-sm btn-ghost"
                >
                  Add to Queue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}