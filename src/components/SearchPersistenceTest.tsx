"use client";

import React from "react";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";
import { useAppContext } from "@/contexts/AppContext";

/**
 * Test component to verify search state persistence across navigation
 */
export default function SearchPersistenceTest() {
  const { 
    results, 
    query, 
    setQuery, 
    searchType, 
    setSearchType, 
    handleSearch 
  } = useSearch();
  
  const { searchResults, searchQuery } = useAppContext();

  const handleTestSearch = async () => {
    setQuery("test song");
    await handleSearch("test song");
  };

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <h2 className="text-2xl font-bold">Search Persistence Test</h2>
      
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Search State</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Query:</strong> "{query || 'None'}"
          </div>
          <div>
            <strong>Search Type:</strong> {searchType}
          </div>
          <div>
            <strong>Track Results:</strong> {results.length}
          </div>
          <div>
            <strong>Global Query:</strong> "{searchQuery || 'None'}"
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button 
          className="btn btn-primary" 
          onClick={handleTestSearch}
        >
          Test Search (Set Query)
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={() => setSearchType("artist")}
        >
          Change to Artist Search
        </button>
        
        <button 
          className="btn btn-accent"
          onClick={() => setQuery("different query")}
        >
          Change Query
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link href="/search" className="btn btn-info">
          Go to Search Page
        </Link>
        
        <Link href="/" className="btn btn-ghost">
          Go to Home
        </Link>
        
        <Link href="/queue" className="btn btn-ghost">
          Go to Queue
        </Link>
      </div>

      <div className="bg-info/10 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">🧪 Test Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Test Search" to set a query and perform a search</li>
          <li>Navigate to different pages using the buttons above</li>
          <li>Return to any page and verify that the search query and results persist</li>
          <li>The search state should remain the same across all navigation</li>
        </ol>
      </div>

      {results.length > 0 && (
        <div className="bg-success/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">✅ Search Results ({results.length} tracks)</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.slice(0, 5).map((track) => (
              <div key={track.id} className="text-sm p-2 bg-base-100 rounded">
                <strong>{track.name}</strong> by {track.artists.map(a => a.name).join(", ")}
              </div>
            ))}
            {results.length > 5 && (
              <div className="text-sm text-base-content/70">
                ... and {results.length - 5} more results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}