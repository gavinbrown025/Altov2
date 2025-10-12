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
} from "@/types/spotify";
import { get } from "http";

interface SpotifyError {
  message: string;
  status?: number;
}

// Much simpler hook - just uses the proxy API route
export function useSpotifyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SpotifyError | null>(null);

  const spotifyRequest = useCallback(
    async <T>(endpoint: string): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`
        );

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

  const getCurrentQueue = useCallback(
    () => spotifyRequest<SpotifyQueue>("/me/player/queue"),
    [spotifyRequest]
  );

  const getRecommendations = useCallback(
    async (params: {
      seedTracks?: SpotifyTrack[];
      seedArtists?: string[];
      limit?: number;
    }) => {
      console.log(params);
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
          .flatMap((result) => (result.tracks?.items ?? []))
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
        const shuffledTracks = uniqueTracks.sort(() => 0.5 - Math.random());

        return {
          tracks: shuffledTracks.slice(0, limit),
        };
      } catch (error) {
        console.error("Failed to get recommendations via search:", error);
        throw error;
      }
    },
    [search]
  );

  // Playback control functions
  const playTrack = useCallback(async (trackId: string, deviceId?: string) => {
    const endpoint = `/me/player/play${
      deviceId ? `?device_id=${deviceId}` : ""
    }`;
    const body = JSON.stringify({
      uris: [`spotify:track:${trackId}`],
    });

    const response = await fetch(
      `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to play track: ${response.statusText}`);
    }
  }, []);

  const pausePlayback = useCallback(async (deviceId?: string) => {
    const endpoint = `/me/player/pause${
      deviceId ? `?device_id=${deviceId}` : ""
    }`;
    const response = await fetch(
      `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to pause: ${response.statusText}`);
    }
  }, []);

  const resumePlayback = useCallback(async (deviceId?: string) => {
    const endpoint = `/me/player/play${
      deviceId ? `?device_id=${deviceId}` : ""
    }`;
    const response = await fetch(
      `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to resume: ${response.statusText}`);
    }
  }, []);

  const nextTrack = useCallback(async (deviceId?: string) => {
    const endpoint = `/me/player/next${
      deviceId ? `?device_id=${deviceId}` : ""
    }`;
    const response = await fetch(
      `/api/spotify?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to skip: ${response.statusText}`);
    }
  }, []);

  return {
    loading,
    error,
    getCurrentUser,
    getUserPlaylists,
    getTopTracks,
    getTopArtists,
    search,
    getRecentlyPlayed,
    getCurrentQueue,
    spotifyRequest,
    getRecommendations,
    // Playback controls
    playTrack,
    pausePlayback,
    resumePlayback,
    nextTrack,
  };
}
