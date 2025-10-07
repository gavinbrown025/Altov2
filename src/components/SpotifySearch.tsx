"use client";

import UIIcon from "@/components/UIIcon";
import { useSearch } from "@/contexts/SearchContext";

export default function SpotifySearch() {
  const {
    query,
    setQuery,
    loading,
    error,
    searchType,
    setSearchType,
    handleSearch,
  } = useSearch();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await handleSearch();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <div className="join">
          <label className="input grow join-item">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
            />
          </label>
          <select
            className="select join-item w-min"
            value={searchType}
            onChange={(e) =>
              setSearchType(
                e.target.value as "track" | "artist" | "album" | "playlist"
              )
            }
          >
            <option value="track">Song</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="playlist">Playlist</option>
          </select>
          <button
            className="join-item btn btn-primary"
            disabled={loading || !query.trim()}
            type="submit"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <UIIcon iconName="search" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}
