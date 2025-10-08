"use client";

import TrackListItem from "@/components/TrackListIem";
import { useSearch } from "@/contexts/SearchContext";

export default function Search() {
  const { results } = useSearch();
  if (results.length === 0) return <h1>Search</h1>;

  return (
    <div>
      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Search Results</h3>
          <div className="space-y-3">
            {results.map((track) => (
              <TrackListItem key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
