"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import DashboardLoading from "./DashboardLoading";
import NoUser from "./NoUser";
import UserCard from "./UserCard";
import PlayLists from "./PlayLists";
import TopTracks from "./TopTracks";
import Recommendations from "./Recommendations";

interface DashboardContentProps {}

export default function DashboardContent() {
  const { user, loading } = useDashboard();
  if (loading) return <DashboardLoading />;
  if (!user) return <NoUser />;

  try {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserCard className="col-span-full bg-base-200" />
        <PlayLists />
        <TopTracks />
        <Recommendations />
      </div>
    );
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return <NoUser error={error} />;
  }
}
