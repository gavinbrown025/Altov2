"use client";

import { useState } from "react";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import type { SpotifyTrack } from "@/types/spotify";

export default function SpotifySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const { search, loading, error } = useSpotifyApi();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const searchResults = await search(query, "track", 10);
      setResults(searchResults.tracks?.items || []);
    } catch (err) {
      // Error is handled by the hook
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Search Spotify</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tracks..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error.message}</p>
        </div>
      )}

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
                  {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
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