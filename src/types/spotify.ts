// Spotify API Types

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  followers: {
    total: number;
  };
  images: SpotifyImage[];
  country: string;
  product: string;
}

export interface SpotifyImage {
  height: number | null;
  url: string;
  width: number | null;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  publisher: string;
  languages: string[];
  explicit: boolean;
  total_episodes: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  duration_ms: number;
  explicit: boolean;
  release_date: string;
  release_date_precision: string;
  show: SpotifyShow;
  type: "episode";
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
  public: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifySearchResponse {
  tracks?: SpotifyPaginatedResponse<SpotifyTrack>;
  artists?: SpotifyPaginatedResponse<SpotifyArtist>;
  albums?: SpotifyPaginatedResponse<SpotifyAlbum>;
  playlists?: SpotifyPaginatedResponse<SpotifyPlaylist>;
}

export interface SpotifyRecentTrack {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
}

export interface SpotifyCurrentPlayback {
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: "off" | "track" | "context";
  timestamp: number;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
  progress_ms: number;
  item: SpotifyTrack | SpotifyEpisode | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  is_playing: boolean;
}

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | SpotifyEpisode | null;
  queue: SpotifyMediaItem[];
}

// Union type for media items that can be either tracks or episodes
export type SpotifyMediaItem = SpotifyTrack | SpotifyEpisode;