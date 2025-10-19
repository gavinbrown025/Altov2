"use client";

import React, { useState, useCallback } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { useQueue } from "@/contexts/QueueContext";
import { useSpotifyToken } from "@/hooks/useSpotifyToken";
import type { SpotifyTrack } from "@/types/spotify";

export default function Player({ className }: { className?: string }) {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const { playbackState, setPlaybackState, setDeviceId, refreshQueue } =
    useQueue();

  const [playerReady, setPlayerReady] = useState(false);

  const isNewTrack = (track: SpotifyTrack) => {
    return (
      !playbackState.currentURI ||
      track.id !== playbackState.currentURI
    );
  };

  // Handle track changes and playback state updates
  const handlePlayerCallback = useCallback(
    async (state: any) => {
      if (!state) return;
      // Initialize device when ready
      if (!playerReady && state.deviceId && token) {
        setDeviceId(state.deviceId);
        setPlayerReady(true);
      }
      // Refresh queue on track change
      if (state.track?.id && isNewTrack(state.track)) {
        refreshQueue();
      }
      console.log("Player state changed:", state);

      setPlaybackState({
        currentURI: state.track,
        isPlaying: !state.paused,
        paused: state.paused,
        position: state.position,
        duration: state.duration,
        shuffle: state.shuffle,
        repeat_mode: state.repeat_mode,
        offset: state.offset,
      });
    },
    [playerReady, token, playbackState.currentURI, setPlaybackState]
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
