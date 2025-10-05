"use client";

import { useState, useCallback } from "react";
import type {
  SpotifyUser,
  SpotifyPaginatedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyArtist,
  SpotifySearchResponse,
} from "@/types/spotify";

interface SpotifyError {
  message: string;
  status?: number;
}

// Much simpler hook - just uses the proxy API route
export function useSpotifyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SpotifyError | null>(null);

  const spotifyRequest = useCallback(async <T>(endpoint: string): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/spotify?endpoint=${encodeURIComponent(endpoint)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // API Methods - much cleaner now
  const getCurrentUser = useCallback(() => spotifyRequest<SpotifyUser>("/me"), [spotifyRequest]);

  const getUserPlaylists = useCallback(
    (limit = 20, offset = 0) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyPlaylist>>(`/me/playlists?limit=${limit}&offset=${offset}`),
    [spotifyRequest]
  );

  const getTopTracks = useCallback(
    (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 20) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyTrack>>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`),
    [spotifyRequest]
  );

  const getTopArtists = useCallback(
    (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 20) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyArtist>>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`),
    [spotifyRequest]
  );

  const search = useCallback(
    (query: string, type: "track" | "artist" | "album" | "playlist" = "track", limit = 20) => {
      const encodedQuery = encodeURIComponent(query);
      return spotifyRequest<SpotifySearchResponse>(`/search?q=${encodedQuery}&type=${type}&limit=${limit}`);
    },
    [spotifyRequest]
  );

  const getRecentlyPlayed = useCallback(
    (limit = 20) => spotifyRequest<SpotifyPaginatedResponse<any>>(`/me/player/recently-played?limit=${limit}`),
    [spotifyRequest]
  );

  return {
    loading,
    error,
    getCurrentUser,
    getUserPlaylists,
    getTopTracks,
    getTopArtists,
    search,
    getRecentlyPlayed,
    spotifyRequest,
  };
}
