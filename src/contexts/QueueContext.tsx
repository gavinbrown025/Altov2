"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import type { SpotifyTrack } from "@/types/spotify";

interface PlaybackState {
  isPlaying: boolean;
  paused: boolean;
  position: number; // Current position in ms
  duration: number; // Track duration in ms
  shuffle: boolean;
  repeat_mode: 0 | 1 | 2;
}

interface QueueContextType {
  // Queue state
  currentTrack: SpotifyTrack | null;
  queue: SpotifyTrack[];
  loading: boolean;
  error: string | null;

  // Playback state (from Web Playback SDK)
  playbackState: PlaybackState | null;

  // Actions
  refreshQueue: () => Promise<void>;
  updatePlaybackState: (state: PlaybackState) => void;
  setCurrentTrack: (track: SpotifyTrack | null) => void;
  setDeviceId: (id: string) => void;

  // Simple playback controls (minimal API calls)
  playTrack: (track: SpotifyTrack) => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
}

export function QueueProvider({ children }: QueueProviderProps) {
  // Queue state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<SpotifyTrack[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);

  // Playback state (updated from Player component)
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  const {
    getCurrentQueue,
    playTrack: apiPlayTrack,
    pausePlayback: apiPausePlayback,
    resumePlayback: apiResumePlayback,
    nextTrack: apiNextTrack
  } = useSpotifyApi();

  const updatePlaybackState = useCallback((state: PlaybackState) => {
    setPlaybackState(state);
  }, []);

  // Simple playback controls - using the cleaner API hook
  const playTrack = useCallback(async (track: SpotifyTrack) => {
    try {
      // Check if this track is the same as current track
      if (currentTrack?.id === track.id) {
        // Just resume playback of current track
        await apiResumePlayback(deviceId || undefined);
        return;
      }

      // Find the track in the queue
      const queueIndex = queue.findIndex(queueTrack => queueTrack.id === track.id);

      if (queueIndex !== -1) {
        // Track is in queue - skip to it by calling next() repeatedly
        console.log(`Track found at queue position ${queueIndex}, skipping...`);

        for (let i = 0; i < queueIndex + 1; i++) {
          await apiNextTrack(deviceId || undefined);
          // Small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Update current track immediately for better UX
        setCurrentTrack(track);
      } else {
        // Track not in queue - fall back to playing it directly (will create new context)
        console.log("Track not in queue, playing directly");
        await apiPlayTrack(track.id, deviceId || undefined);
        setCurrentTrack(track);
      }
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  }, [deviceId, currentTrack, queue, apiResumePlayback, apiNextTrack, apiPlayTrack]);

  const togglePlayPause = useCallback(async () => {
    try {
      if (playbackState?.isPlaying) {
        await apiPausePlayback(deviceId || undefined);
      } else {
        await apiResumePlayback(deviceId || undefined);
      }
    } catch (error) {
      console.error("Failed to toggle playback:", error);
    }
  }, [playbackState?.isPlaying, deviceId, apiPausePlayback, apiResumePlayback]);

  const refreshQueue = async () => {
    setLoading(true);
    setError(null);

    try {
      const queueData = await getCurrentQueue();
      console.log("Queue data:", queueData);
      if (queueData) {
        setCurrentTrack(queueData.currently_playing);
        setQueue(queueData.queue);
      } else {
        // No active playback
        setCurrentTrack(null);
        setQueue([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get queue";
      setError(errorMessage);
      console.error("Failed to get current queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const value: QueueContextType = {
    currentTrack,
    queue,
    loading,
    error,
    playbackState,
    setDeviceId,
    refreshQueue,
    setCurrentTrack,
    updatePlaybackState,
    playTrack,
    togglePlayPause,
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
