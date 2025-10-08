"use client";

import React, { useState, useEffect, useCallback } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { useQueue } from "@/contexts/QueueContext";

export default function Player({ className }: { className?: string }) {
  // Token management
  const [token, setToken] = useState<string>("");
  const [playerUris, setPlayerUris] = useState<string[]>([]);

  const { refreshQueue } = useQueue();

  // Fetch Spotify token
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch("/api/spotify/token");
        if (response.ok) {
          const data = await response.json();
          setToken(data.access_token);
        }
      } catch (error) {
        console.error("Failed to get Spotify token:", error);
      }
    };

    getToken();
  }, []);

  const handlePlaybackState = (state: any) => {
    console.log("Playback state changed:", state);
    refreshQueue();
  };

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
            activeColor: "#1db954",
            bgColor: "#181818",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1db954",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
          callback={handlePlaybackState}
          play={true}
        />
      </div>
    </div>
  );
}
