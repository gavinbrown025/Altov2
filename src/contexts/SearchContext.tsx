"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import type { SpotifyTrack } from "@/types/spotify";

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SpotifyTrack[];
  loading: boolean;
  error: { message: string } | null;
  searchType: "track" | "artist" | "album" | "playlist";
  setSearchType: (type: "track" | "artist" | "album" | "playlist") => void;
  handleSearch: (searchQuery?: string) => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [searchType, setSearchType] = useState<"track" | "artist" | "album" | "playlist">("track");
  const { search, loading, error } = useSpotifyApi();

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    try {
      const searchResults = await search(queryToSearch, searchType, 10);
      // Handle different search types - for now focusing on tracks
      if (searchType === "track" && searchResults.tracks?.items) {
        setResults(searchResults.tracks.items);
      } else {
        // For other types, we might need to handle them differently
        // For now, clear results if not tracks
        setResults([]);
      }
    } catch (err) {
      // Error is handled by the hook
      console.error("Search failed:", err);
      setResults([]);
    }
  };

  const clearResults = () => {
    setResults([]);
    setQuery("");
  };

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    loading,
    error,
    searchType,
    setSearchType,
    handleSearch,
    clearResults,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}