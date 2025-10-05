import { auth, clerkClient } from "@clerk/nextjs/server";
import type {
  SpotifyUser,
  SpotifyPaginatedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyPlaylistTrack,
  SpotifySearchResponse,
  SpotifyRecentlyPlayedTrack,
  SpotifyCurrentPlayback,
} from "@/types/spotify";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

/**
 * Simple helper to make Spotify API requests - gets token on demand
 */
async function spotifyFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const client = await clerkClient();
  const tokenResponse = await client.users.getUserOauthAccessToken(userId, "spotify");

  if (tokenResponse.data.length === 0) {
    throw new Error("No Spotify connection found. Please sign in with Spotify.");
  }

  const token = tokenResponse.data[0].token;
  const url = `${SPOTIFY_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Spotify API error: ${response.status} ${response.statusText}. ${
        errorData.error?.message || ""
      }`
    );
  }

  return response.json();
}

// Server-side API functions - these run on the server and automatically get tokens from Clerk
export async function getCurrentUserProfile(): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>("/me");
}

export async function getCurrentUserPlaylists(limit = 20, offset = 0): Promise<SpotifyPaginatedResponse<SpotifyPlaylist>> {
  return spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylist>>(`/me/playlists?limit=${limit}&offset=${offset}`);
}

export async function getCurrentUserTopTracks(
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
  limit = 20
): Promise<SpotifyPaginatedResponse<SpotifyTrack>> {
  return spotifyFetch<SpotifyPaginatedResponse<SpotifyTrack>>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

export async function getCurrentUserTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
  limit = 20
): Promise<SpotifyPaginatedResponse<SpotifyArtist>> {
  return spotifyFetch<SpotifyPaginatedResponse<SpotifyArtist>>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}

export async function getPlaylistTracks(playlistId: string, limit = 200, offset = 0): Promise<SpotifyPaginatedResponse<SpotifyPlaylistTrack>> {
  return spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylistTrack>>(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
}

export async function searchSpotify(
  query: string,
  type: "track" | "artist" | "album" | "playlist" = "track",
  limit = 20
): Promise<SpotifySearchResponse> {
  const encodedQuery = encodeURIComponent(query);
  return spotifyFetch<SpotifySearchResponse>(`/search?q=${encodedQuery}&type=${type}&limit=${limit}`);
}

export async function getRecentlyPlayedTracks(limit = 20): Promise<SpotifyPaginatedResponse<SpotifyRecentlyPlayedTrack>> {
  return spotifyFetch<SpotifyPaginatedResponse<SpotifyRecentlyPlayedTrack>>(`/me/player/recently-played?limit=${limit}`);
}

export async function getCurrentPlaybackState(): Promise<SpotifyCurrentPlayback | null> {
  try {
    return await spotifyFetch<SpotifyCurrentPlayback>("/me/player");
  } catch (error) {
    // Spotify returns 204 No Content when no device is active
    if (error instanceof Error && error.message.includes("204")) {
      return null;
    }
    throw error;
  }
}
