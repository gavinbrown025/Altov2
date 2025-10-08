"use client";

import { useState, useEffect } from "react";

export function useSpotifyToken() {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/spotify/token");

        if (!response.ok) {
          throw new Error("Failed to fetch Spotify token");
        }

        const data = await response.json();
        setToken(data.access_token);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to get Spotify token";
        setError(errorMessage);
        console.error("Failed to get Spotify token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, loading, error };
}