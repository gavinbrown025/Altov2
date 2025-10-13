"use client";

import React, { useState, useCallback } from "react";
import SpotifyPlayer, {
  spotifyApi,
  SpotifyTrack,
} from "react-spotify-web-playback";
import { useQueue } from "@/contexts/QueueContext";
import { useSpotifyToken } from "@/hooks/useSpotifyToken";

export default function Player({ className }: { className?: string }) {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const {
    setDeviceId,
    refreshQueue,
    currentTrack,
    playbackState,
    setPlaybackState,
  } = useQueue();

  const [playerReady, setPlayerReady] = useState(false);

  const initializePlayerDevice = useCallback(
    async (deviceId: string) => {
      try {
        await spotifyApi.setDevice(token, deviceId, false);
        setDeviceId(deviceId);
        setPlayerReady(true);
      } catch (error) {
        console.error("Failed to set device:", error);
        return;
      }
    },
    [token, setDeviceId]
  );

  const isNewTrack = (track: SpotifyTrack) => {
    return !currentTrack || track.id !== currentTrack.id;
  };

  // Handle track changes and playback state updates
  const handlePlayerCallback = useCallback(
    async (state: any) => {
      if (!state) return;
      // Initialize device when ready
      if (!playerReady && state.deviceId && token) {
        initializePlayerDevice(state.deviceId);
      }
      // Refresh queue on track change
      if (state.track?.id && isNewTrack(state.track)) {
        refreshQueue();
      }

      // Update playback state
      const { paused, position, duration, shuffle, repeat_mode, offset } =
        state;
      setPlaybackState({
        isPlaying: !paused,
        paused,
        position,
        duration,
        shuffle,
        repeat_mode,
        offset,
      });
    },
    [
      playerReady,
      token,
      currentTrack,
      initializePlayerDevice,
      refreshQueue,
      setPlaybackState,
    ]
  );

  // Loading state
  const TokenLoading = () => (
    <div className={`bg-base-300 p-4 grid place-items-center ${className}`}>
      <span className="loading loading-ring loading-xl"></span>
    </div>
  );

  // Error state
  const TokenError = () => (
    <div className={`bg-base-300 p-4 ${className}`}>
      <div className="text-center text-error">
        Your Account is not Authorized to use Spotify Player.
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="bg-base-300 px-4 py-2">
        {tokenLoading ? (
          <TokenLoading />
        ) : tokenError ? (
          <TokenError />
        ) : (
          <SpotifyPlayer
            token={token}
            uris={[]}
            play={false}
            offset={playbackState.offset}
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
