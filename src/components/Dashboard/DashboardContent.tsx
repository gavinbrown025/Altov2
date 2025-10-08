"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import TopTracks from "./TopTracks";
import DashboardLoading from "./DashboardLoading";
import NoUser from "./NoUser";
import PlayLists from "./PlayLists";
import UserCard from "./UserCard";

interface DashboardContentProps {}

export default function DashboardContent() {
  const { user, playlists, topTracks, loading } = useDashboard();
  if (loading) return <DashboardLoading />;
  if (!user) return <NoUser />;

  try {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserCard className="col-span-full bg-base-200" />
        <PlayLists />
        <TopTracks />
      </div>
    );
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return <NoUser error={error} />;
  }
}
