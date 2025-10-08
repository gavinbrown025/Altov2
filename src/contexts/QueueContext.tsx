"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { SpotifyTrack } from "@/types/spotify";

interface QueueItem {
  track: SpotifyTrack;
  uri: string;
  id: string;
}

interface PlayerState {
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
  position: number;
  duration: number;
}

interface QueueContextType {
  // Queue state
  masterQueue: QueueItem[];
  currentIndex: number;
  playerState: PlayerState;

  // Queue actions
  playTracks: (tracks: SpotifyTrack[]) => void;
  addToQueue: (track: SpotifyTrack) => void;
  removeFromQueue: (itemId: string) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  skipToTrack: (itemId: string) => void;
  clearQueue: () => void;

  // Player actions
  updatePlayerState: (state: PlayerState) => void;
  updateCurrentIndex: (index: number) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
}

export function QueueProvider({ children }: QueueProviderProps) {
  const [masterQueue, setMasterQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
  });

  const playTracks = useCallback((tracks: SpotifyTrack[]) => {
    const queueItems: QueueItem[] = tracks.map((track, index) => ({
      track,
      uri: `spotify:track:${track.id}`,
      id: `${track.id}-${Date.now()}-${index}`,
    }));

    setMasterQueue(queueItems);
    setCurrentIndex(0);
  }, []);

  const addToQueue = useCallback((track: SpotifyTrack) => {
    const queueItem: QueueItem = {
      track,
      uri: `spotify:track:${track.id}`,
      id: `${track.id}-${Date.now()}`,
    };

    setMasterQueue((prev) => [...prev, queueItem]);
  }, []);

  const removeFromQueue = useCallback(
    (itemId: string) => {
      setMasterQueue((prev) => {
        const newQueue = prev.filter((item) => item.id !== itemId);
        const removedIndex = prev.findIndex((item) => item.id === itemId);

        // Adjust current index if needed
        if (removedIndex < currentIndex) {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
        } else if (
          removedIndex === currentIndex &&
          currentIndex >= newQueue.length
        ) {
          setCurrentIndex(Math.max(0, newQueue.length - 1));
        }

        return newQueue;
      });
    },
    [currentIndex]
  );

  const reorderQueue = useCallback(
    (startIndex: number, endIndex: number) => {
      setMasterQueue((prev) => {
        const newQueue = [...prev];
        const [reorderedItem] = newQueue.splice(startIndex, 1);
        newQueue.splice(endIndex, 0, reorderedItem);

        // Adjust current index based on the move
        let newCurrentIndex = currentIndex;
        if (startIndex === currentIndex) {
          newCurrentIndex = endIndex;
        } else if (startIndex < currentIndex && endIndex >= currentIndex) {
          newCurrentIndex = currentIndex - 1;
        } else if (startIndex > currentIndex && endIndex <= currentIndex) {
          newCurrentIndex = currentIndex + 1;
        }

        setCurrentIndex(newCurrentIndex);
        return newQueue;
      });
    },
    [currentIndex]
  );

  const skipToTrack = useCallback(
    (itemId: string) => {
      const newIndex = masterQueue.findIndex((item) => item.id === itemId);
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
      }
    },
    [masterQueue]
  );

  const clearQueue = useCallback(() => {
    setMasterQueue([]);
    setCurrentIndex(0);
  }, []);

  const updatePlayerState = useCallback((state: PlayerState) => {
    setPlayerState(state);
  }, []);

  const updateCurrentIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const value: QueueContextType = {
    masterQueue,
    currentIndex,
    playerState,
    playTracks,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    skipToTrack,
    clearQueue,
    updatePlayerState,
    updateCurrentIndex,
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
