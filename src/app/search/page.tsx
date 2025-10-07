"use client";

import { useSearch } from "@/contexts/SearchContext";

export default function Search() {
  const { results } = useSearch();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Search</h2>
      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Search Results</h3>
          <div className="space-y-3">
            {results.map((track) => (
              <div
                key={track.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {track.album.images && track.album.images[0] && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {track.artists.map((artist) => artist.name).join(", ")} •{" "}
                    {track.album.name}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.floor(track.duration_ms / 60000)}:
                  {String(
                    Math.floor((track.duration_ms % 60000) / 1000)
                  ).padStart(2, "0")}
                </div>
                {track.preview_url && (
                  <audio controls className="w-32">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}