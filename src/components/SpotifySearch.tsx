"use client";

import UIIcon from "@/components/UIIcon";
import { useSearch } from "@/contexts/SearchContext";
import { useRouter } from "next/navigation";

export default function SpotifySearch() {
  const {
    query,
    setQuery,
    loading,
    error,
    searchType,
    setSearchType,
    handleSearch,
    results,
  } = useSearch();
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await handleSearch();
    router.push("/search");
  };

  const handleSearchFocus = () => {
    if (results.length > 0) router.push("/search");
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
              onFocus={handleSearchFocus}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}
