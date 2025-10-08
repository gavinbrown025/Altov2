'use client';

import React, { useState, useEffect, useCallback } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { useQueue } from "@/contexts/QueueContext";

export default function Player({ className }: { className?: string }) {
  // Token management
  const [token, setToken] = useState<string>("");
  const [playerUris, setPlayerUris] = useState<string[]>([]);

  // Queue management from context
  const {
    masterQueue,
    currentIndex,
    playerState,
    updatePlayerState,
    updateCurrentIndex
  } = useQueue();

  // Fetch Spotify token
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch('/api/spotify/token');
        if (response.ok) {
          const data = await response.json();
          setToken(data.access_token);
        }
      } catch (error) {
        console.error('Failed to get Spotify token:', error);
      }
    };

    getToken();
  }, []);

  // Sync master queue to player URIs
  const syncQueue = useCallback(() => {
    if (masterQueue.length === 0) {
      setPlayerUris([]);
      return;
    }

    // Get URIs from current index forward
    const urisFromCurrent = masterQueue.slice(currentIndex).map(item => item.uri);
    setPlayerUris(urisFromCurrent);
  }, [masterQueue, currentIndex]);

  // Sync queue when it changes
  useEffect(() => {
    syncQueue();
  }, [syncQueue]);

  // Handle player callbacks
  const handlePlayerCallback = useCallback((state: any) => {
    if (!state) return;

    updatePlayerState({
      isPlaying: !state.paused,
      currentTrack: state.track_window?.current_track || null,
      position: state.position,
      duration: state.duration,
    });

    // Handle track changes
    if (state.track_window?.current_track && !state.paused) {
      const currentTrackUri = state.track_window.current_track.uri;
      const expectedUri = masterQueue[currentIndex]?.uri;

      // If we've moved to the next track, update our index
      if (currentTrackUri !== expectedUri) {
        const newIndex = masterQueue.findIndex(item => item.uri === currentTrackUri);
        if (newIndex !== -1 && newIndex !== currentIndex) {
          updateCurrentIndex(newIndex);
        }
      }
    }
  }, [masterQueue, currentIndex, updatePlayerState, updateCurrentIndex]);

  if (!token) {
    return (
      <div className={`bg-base-300 p-4 rounded-lg ${className}`}>
        <div className="text-center">Loading Spotify Player...</div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="bg-base-300 rounded-lg overflow-hidden">
        <SpotifyPlayer
          token={token}
          uris={playerUris}
          styles={{
            activeColor: '#1db954',
            bgColor: '#181818',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1db954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
          callback={handlePlayerCallback}
          play={true}
        />

        {/* Queue Info Display */}
        {masterQueue.length > 0 && (
          <div className="p-4 bg-base-200">
            <div className="text-sm opacity-70">
              Queue: {currentIndex + 1} of {masterQueue.length} tracks
            </div>
            <div className="text-xs opacity-50 mt-1">
              Next: {masterQueue[currentIndex + 1]?.track.name || 'End of queue'}
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
