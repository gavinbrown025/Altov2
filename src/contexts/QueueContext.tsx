"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { SpotifyTrack, SpotifyQueue } from "@/types/spotify";
import { useSpotifyToken } from "@/hooks/useSpotifyToken";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { spotifyApi } from "react-spotify-web-playback";

interface PlaybackState {
  currentURI: string;
  isPlaying: boolean;
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  offset: number;
  repeat_mode: 0 | 1 | 2;
}
const initialPlaybackState: PlaybackState = {
  currentURI: "",
  isPlaying: false,
  paused: true,
  position: 0,
  duration: 0,
  shuffle: false,
  offset: 0,
  repeat_mode: 0,
};

const emptyQueue: SpotifyQueue = {
  currently_playing: null,
  queue: [],
};

interface QueueContextType {
  // Queue state
  loading: boolean;
  error: string | null;
  queue: SpotifyQueue;

  // Playback state (from Web Playback SDK)
  playbackState: PlaybackState;

  // Actions
  setPlaybackState: (state: PlaybackState) => void;
  setDeviceId: (id: string) => void;
  refreshQueue: () => Promise<void>;

  // Playback controls
  playTrack: (trackId: string) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [deviceId, setDeviceId] = useState<string>("");
  const { token } = useSpotifyToken();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [queue, setQueue] = useState<SpotifyQueue>(emptyQueue);
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(initialPlaybackState);
  const { getCurrentQueue, getRecommendations, addToQueue } = useSpotifyApi();

  // Initialize Spotify Web Playback SDK when token and deviceId are available
  useEffect(() => {
    const initializePlayer = async () => {
      if (token && deviceId) {
        await spotifyApi.setDevice(token, deviceId);
      }
    };
    initializePlayer();
  }, [token, deviceId]);

  // Playback control functions using react-spotify-web-playback
  const playTrack = async (trackId: string) => {
    try {
      await spotifyApi.play(token, {
        deviceId,
        uris: [`spotify:track:${trackId}`],
      });
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  };

  const pausePlayback = async () => {
    try {
      await spotifyApi.pause(token, deviceId);
    } catch (error) {
      console.error("Failed to pause playback:", error);
      throw error;
    }
  };

  const resumePlayback = async () => {
    try {
      await spotifyApi.play(token, { deviceId });
    } catch (error) {
      console.error("Failed to resume playback:", error);
      throw error;
    }
  };

  const getQueueRecommendations = async (queueData: SpotifyQueue) => {
    // Create seed tracks from current + first few queued tracks
    const seedTracks: SpotifyTrack[] = [queueData.currently_playing, ...queueData.queue].filter(
      (track): track is SpotifyTrack => track !== null
    );

    try {
      // Get recommendations
      const recommendations = await getRecommendations({
        seedTracks,
      });

      console.log("Got recommendations:", recommendations.tracks.length);

      await Promise.all(
        recommendations.tracks.map((track) => addToQueue(track.id))
      );

      // Refresh queue to get updated state
      const updatedQueueData = await getCurrentQueue();
      return updatedQueueData;
    } catch (recError) {
      console.error("Failed to get recommendations:", recError);
    }
  };

  const refreshQueue = async () => {
    if (!token) {
      console.log("No token available for queue refresh");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current queue from Spotify
      const queueData = await getCurrentQueue();
      console.log("Current queue:", queueData);

      setQueue(queueData);

      // Check if we need more tracks (less than 10 total including current)
      const totalTracks =
        queueData.queue.length + (queueData.currently_playing ? 1 : 0);
      console.log(`Total tracks in queue: ${totalTracks}`);

      if (totalTracks < 10 && queueData.currently_playing) {
        const updatedQueueData = await getQueueRecommendations(queueData);
        if (updatedQueueData) setQueue(updatedQueueData);
      }
    } catch (error) {
      console.error("Failed to refresh queue:", error);
      setError("Failed to refresh queue");
    } finally {
      setLoading(false);
    }
  };


  const value: QueueContextType = {
    queue,
    loading,
    error,
    playbackState,
    setDeviceId,
    setPlaybackState,
    refreshQueue,
    // Playback controls
    playTrack,
    pausePlayback,
    resumePlayback,
  };

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
