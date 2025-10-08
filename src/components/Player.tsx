"use client";

import React, { useState, useCallback } from "react";
import SpotifyPlayer, { spotifyApi } from "react-spotify-web-playback";
import { useQueue } from "@/contexts/QueueContext";
import { useSpotifyToken } from "@/hooks/useSpotifyToken";

export default function Player({ className }: { className?: string }) {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const { currentTrack, updatePlaybackState, refreshQueue } = useQueue();

  const [playerReady, setPlayerReady] = useState(false);

  // Initialize player device and load queue
  const initializePlayerDevice = useCallback(
    async (deviceId: string) => {
      if (!token || playerReady) return;

      try {
        await spotifyApi.setDevice(token, deviceId, false);
        setPlayerReady(true);
        setTimeout(refreshQueue, 1500);
      } catch (error) {
        console.error("Failed to initialize player device:", error);
      }
    },
    [token, playerReady, refreshQueue]
  );

  // Handle track changes and playback state updates
  const handlePlayerCallback = useCallback(
    (state: any) => {
      if (!state) return;

      // Initialize device when ready
      if (!playerReady && state.deviceId && token) {
        initializePlayerDevice(state.deviceId);
      }

      // Refresh queue on track change
      if (
        state.track?.id &&
        (!currentTrack || state.track.id !== currentTrack.id)
      ) {
        refreshQueue();
      }

      // Update playback state
      const { paused, position, duration, shuffle, repeat_mode } = state;
      updatePlaybackState({
        isPlaying: !paused,
        paused,
        position,
        duration,
        shuffle,
        repeat_mode,
      });
    },
    [
      playerReady,
      token,
      currentTrack,
      initializePlayerDevice,
      refreshQueue,
      updatePlaybackState,
    ]
  );

  // Loading state
  const TokenLoading = () => (
    <div className={`bg-base-300 p-4 rounded-lg ${className}`}>
      <span className="loading loading-ring loading-xl"></span>
    </div>
  );

  // Error state
  const TokenError = () => (
    <div className={`bg-base-300 p-4 rounded-lg ${className}`}>
      <div className="text-center text-error">
        Your Account is not Authorized to use Spotify Player.
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="bg-base-300 rounded-lg overflow-hidden">
        {tokenLoading ? (
          <TokenLoading />
        ) : tokenError ? (
          <TokenError />
        ) : (
          <SpotifyPlayer
            token={token}
            uris={[]} // Empty array - we sync with external device instead
            styles={{
              activeColor: "oklch(69% 0.17 162.48)",
              bgColor: "transparent",
              color: "#fff",
              loaderColor: "#fff",
              sliderColor: "oklch(69% 0.17 162.48)",
              trackArtistColor: "#ccc",
              trackNameColor: "#fff",
            }}
            callback={handlePlayerCallback}
          />
        )}
      </div>
    </div>
  );
}
