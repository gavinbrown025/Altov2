import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";

export default function PlayLists() {
  const { playlists } = useDashboard();
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <div className="space-y-3">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
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
              <p className="text-sm text-neutral">
                {playlist.tracks.total} tracks • by{" "}
                {playlist.owner.display_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
