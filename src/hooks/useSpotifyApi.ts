"use client";

import { useState, useCallback } from "react";
import type {
  SpotifyUser,
  SpotifyPaginatedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyArtist,
  SpotifySearchResponse,
  SpotifyQueue,
  SpotifyAlbum,
} from "@/types/spotify";

interface SpotifyError {
  message: string;
  status?: number;
}

// Much simpler hook - just uses the proxy API route
export function useSpotifyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SpotifyError | null>(null);

  const spotifyRequest = useCallback(
    async <T>(
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      const url = `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`;

      try {
        const response = await fetch(url, { method });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }
        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError({ message: errorMessage });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // API Methods - much cleaner now
  const getCurrentUser = useCallback(
    () => spotifyRequest<SpotifyUser>("/me"),
    [spotifyRequest]
  );

  const getUserPlaylists = useCallback(
    (limit = 20, offset = 0) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyPlaylist>>(
        `/me/playlists?limit=${limit}&offset=${offset}`
      ),
    [spotifyRequest]
  );

  const getTopTracks = useCallback(
    (
      timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
      limit = 20
    ) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyTrack>>(
        `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
      ),
    [spotifyRequest]
  );

  const getTopArtists = useCallback(
    (
      timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
      limit = 20
    ) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyArtist>>(
        `/me/top/artists?time_range=${timeRange}&limit=${limit}`
      ),
    [spotifyRequest]
  );

  const getArtist = useCallback(
    (artistId: string) => spotifyRequest<SpotifyArtist>(`/artists/${artistId}`),
    [spotifyRequest]
  );

  const getArtistTopTracks = useCallback(
    (artistId: string) =>
      spotifyRequest<{ tracks: SpotifyTrack[] }>(
        `/artists/${artistId}/top-tracks`
      ),
    [spotifyRequest]
  );

  const getArtistAlbums = useCallback(
    (artistId: string) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyAlbum>>(
        `/artists/${artistId}/albums?limit=50&include_groups=album,single`
      ),
    [spotifyRequest]
  );

  const getAlbumTracks = useCallback(
    (albumId: string) =>
      spotifyRequest<SpotifyPaginatedResponse<SpotifyTrack>>(
        `/albums/${albumId}/tracks`
      ),
    [spotifyRequest]
  );

  const search = useCallback(
    (
      query: string,
      type: "track" | "artist" | "album" | "playlist" = "track",
      limit = 20
    ) => {
      const encodedQuery = encodeURIComponent(query);
      return spotifyRequest<SpotifySearchResponse>(
        `/search?q=${encodedQuery}&type=${type}&limit=${limit}`
      );
    },
    [spotifyRequest]
  );

  const getRecentlyPlayed = useCallback(
    (limit = 20) =>
      spotifyRequest<SpotifyPaginatedResponse<any>>(
        `/me/player/recently-played?limit=${limit}`
      ),
    [spotifyRequest]
  );

  const getRecommendations = useCallback(
    async (params: {
      seedTracks?: SpotifyTrack[];
      seedArtists?: string[];
      limit?: number;
    }) => {
      const { seedTracks = [], limit = 20 } = params;

      if (seedTracks.length === 0) {
        throw new Error("Need at least one seed track for recommendations");
      }

      try {
        // Extract data from seed tracks
        const artists = seedTracks.flatMap((track) =>
          track.artists.map((a) => a.name)
        );
        const years = seedTracks.map((track) =>
          new Date(track.album.release_date).getFullYear()
        );

        // Remove duplicates
        const uniqueArtists = [...new Set(artists)];
        const uniqueYears = [...new Set(years)];

        // Create multiple search queries for variety
        const searchQueries = [];

        // Search by artists (most reliable)
        for (const artist of uniqueArtists.slice(0, 3)) {
          searchQueries.push(`artist:"${artist}"`);
        }

        // Search by year range only
        if (uniqueYears.length > 0) {
          const avgYear = Math.round(
            uniqueYears.reduce((a, b) => a + b, 0) / uniqueYears.length
          );
          searchQueries.push(`year:${avgYear - 3}-${avgYear + 3}`);
        }

        // Execute searches in parallel
        const searchResults = await Promise.all(
          searchQueries.map((query) =>
            search(query, "track", Math.ceil(limit / searchQueries.length))
          )
        );
        console.log("Search results for recommendations:", searchResults);

        // Combine and deduplicate results
        const allTracks = searchResults
          .flatMap((result) => result.tracks?.items ?? [])
          .filter(
            (track) =>
              // Exclude seed tracks
              !seedTracks.some((seedTrack) => seedTrack.id === track.id)
          );

        // Remove duplicates by track ID
        const uniqueTracks = allTracks.filter(
          (track, index, self) =>
            index === self.findIndex((t) => t.id === track.id)
        );

        // Shuffle and limit results
        return {
          tracks: uniqueTracks.slice(0, limit),
        };
      } catch (error) {
        console.error("Failed to get recommendations via search:", error);
        throw error;
      }
    },
    [search]
  );

  const getCurrentQueue = useCallback(
    () => spotifyRequest<SpotifyQueue>("/me/player/queue"),
    [spotifyRequest]
  );

  const addToQueue = useCallback(
    async (trackId: string) =>
      await spotifyRequest(
        `/me/player/queue?uri=spotify:track:${trackId}`,
        "POST"
      ),
    [spotifyRequest]
  );

  return {
    loading,
    error,
    spotifyRequest,
    getCurrentUser,
    getUserPlaylists,
    getTopTracks,
    getTopArtists,
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
    getAlbumTracks,
    search,
    getRecentlyPlayed,
    getCurrentQueue,
    getRecommendations,
    addToQueue,
  };
}
