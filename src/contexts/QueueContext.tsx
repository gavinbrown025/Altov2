"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import type { SpotifyTrack } from "@/types/spotify";

interface QueueContextType {
  currentTrack: SpotifyTrack | null;
  queue: SpotifyTrack[];
  loading: boolean;
  error: string | null;

  // Actions
  refreshQueue: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
}

export function QueueProvider({ children }: QueueProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [queue, setQueue] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getCurrentQueue } = useSpotifyApi();

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
      const errorMessage = err instanceof Error ? err.message : "Failed to get queue";
      setError(errorMessage);
      console.error("Failed to get current queue:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load queue on mount
  useEffect(() => {
    refreshQueue();
  }, []);

  const value: QueueContextType = {
    currentTrack,
    queue,
    loading,
    error,
    refreshQueue,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
