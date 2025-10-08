"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import type { SpotifyUser, SpotifyPlaylist, SpotifyTrack } from "@/types/spotify";

interface DashboardData {
  user: SpotifyUser | null;
  playlists: SpotifyPlaylist[];
  topTracks: SpotifyTrack[];
  loading: boolean;
}

const DashboardContext = createContext<DashboardData | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    user: null,
    playlists: [],
    topTracks: [],
    loading: true,
  });

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getCurrentUser, getUserPlaylists, getTopTracks } = useSpotifyApi();

  useEffect(() => {
    // Only load data if Clerk has loaded and user is authenticated
    if (!clerkLoaded) {
      return; // Still loading Clerk
    }

    if (!clerkUser) {
      // User not authenticated, set loading to false
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const loadData = async () => {
      try {
        const [user, playlists, topTracks] = await Promise.all([
          getCurrentUser(),
          getUserPlaylists(10, 0),
          getTopTracks("medium_term", 10),
        ]);

        setData({
          user,
          playlists: playlists.items,
          topTracks: topTracks.items,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, [clerkLoaded, clerkUser]);

  return (
    <DashboardContext.Provider value={data}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}