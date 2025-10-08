import { SpotifyTrack } from "@/types/spotify";
import { formatDuration } from "@/lib/utils";
import { useQueue } from "@/contexts/QueueContext";

import UIIcon from "@/components/UIIcon";

export default function TrackListItem({
  track,
  index,
  isCurrentTrack,
}: {
  track: SpotifyTrack;
  index?: number;
  isCurrentTrack?: boolean;
}) {
  const { currentTrack } = useQueue();

  // If isCurrentTrack is explicitly provided, use that
  // Otherwise, default to checking if this track matches the currently playing track
  const isCurrent = isCurrentTrack !== undefined ? isCurrentTrack : currentTrack?.id === track.id;
  return (
    <div
      key={track.id}
      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 transition-colors ${
        isCurrent ? "bg-base-300" : ""
      }`}
    >
      {index !== null && index !== undefined && (
        <div className={`w-8 text-center text-lg font-bold text-neutral `}>
          {index + 1}
        </div>
      )}
      {track.album.images && track.album.images[0] ? (
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          className="size-12 rounded"
        />
      ) : (
        <div className="size-12 rounded bg-neutral grid place-items-center">
          <UIIcon iconName="hide_image" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate ${isCurrent ? "text-primary" : ""}`}>{track.name}</h4>
        <p className="text-sm text-neutral truncate">
          {track.artists.map((artist) => artist.name).join(", ")} •{" "}
          {track.album.name}
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
}
