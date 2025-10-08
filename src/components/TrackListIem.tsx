import { SpotifyTrack } from "@/types/spotify";
import { formatDuration } from "@/lib/utils";

import UIIcon from "@/components/UIIcon";

export default function TrackListItem({
  track,
  index,
}: {
  track: SpotifyTrack;
  index?: number;
}) {
  return (
    <div
      key={track.id}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
    >
      {index !== null && index !== undefined && (
        <div className="w-8 text-center text-lg font-bold text-neutral">
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
        <h4 className="font-medium truncate">{track.name}</h4>
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
