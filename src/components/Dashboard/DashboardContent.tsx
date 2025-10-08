"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import TopTracks from "@/components/TopTracks";
import DashboardLoading from "./DashboardLoading";
import NoUser from "./NoUser";

interface DashboardContentProps {}

export default function DashboardContent() {
  const { user, playlists, topTracks, loading } = useDashboard();

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) return <NoUser />;

  try {
    return (
      <div className="space-y-8">
        <section className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            {user.images && user.images[0] && (
              <img
                src={user.images[0].url}
                alt={user.display_name || "User"}
                className="size-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{user.display_name}</h1>
              <p className="text-lg opacity-90">
                {user.followers?.total} followers
              </p>
              <p className="opacity-75">
                {user.country} • {user.product}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Playlists Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {playlist.images && playlist.images[0] && (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="size-12 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {playlist.tracks.total} tracks • by{" "}
                      {playlist.owner.display_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Tracks Section */}
          <TopTracks />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return <NoUser error={error} />;
  }
}
