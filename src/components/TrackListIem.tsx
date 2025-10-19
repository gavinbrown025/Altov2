"use client";
import { SpotifyTrack, SpotifyEpisode } from "@/types/spotify";
import { formatDuration } from "@/lib/utils";
import Link from "next/link";
import { useQueue } from "@/contexts/QueueContext";

import UIIcon from "@/components/UIIcon";

type MediaItem = SpotifyTrack | SpotifyEpisode;

export default function TrackListItem({
  track,
  index,
  isCurrentTrack,
}: {
  track: MediaItem;
  index?: number;
  isCurrentTrack?: boolean;
}) {
  const { playbackState, playTrack, pausePlayback, resumePlayback } =
    useQueue();

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback();
    } else {
      await resumePlayback();
    }
  };

  // If isCurrentTrack is explicitly provided, use that
  // Otherwise, default to checking if this track matches the currently playing track
  const isCurrent =
    isCurrentTrack !== undefined
      ? isCurrentTrack
      : playbackState.currentURI === track.id;
  const isPlaying = isCurrent && playbackState.isPlaying;

  // Type guard to check if track is a podcast episode
  const isPodcast = (item: MediaItem): item is SpotifyEpisode => {
    return "type" in item && item.type === "episode";
  };

  // Get the appropriate image, title, and subtitle based on media type
  const getImageData = () => {
    if (isPodcast(track)) {
      return {
        images: track.images || track.show?.images,
        alt: track.show?.name || "Podcast Episode",
      };
    }
    return {
      images: track.album?.images,
      alt: track.album?.name || "Album",
    };
  };

  const getSubtitleText = () => {
    if (isPodcast(track)) {
      return (
        <p className="text-sm text-neutral truncate">
          {track.show?.name || "Unknown Show"}
        </p>
      );
    }
    return (
      <p className="text-sm text-neutral truncate">
        {track.artists?.map((artist, index) => (
          <span key={artist.id}>
            {index > 0 && ","}
            <Link
              href={`/artist/${artist.id}`}
              className="hover:text-base-content"
            >
              {artist.name}
            </Link>
          </span>
        ))}{" "}
        • {track.album?.name || "..."}
      </p>
    );
  };

  const imageData = getImageData();

  const handleTrackClick = async () => {
    if (isCurrent) {
      await togglePlayPause();
    } else {
      // If different track/episode, play it
      await playTrack(track.id);
    }
  };

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
      <div className="group relative size-12 rounded bg-neutral grid place-items-center">
        <div
          className="cursor-pointer z-10 hidden absolute size-full bg-base-300/40 inset-0 group-hover:grid place-items-center"
          onClick={handleTrackClick}
        >
          {isPlaying ? (
            <UIIcon iconName="pause" />
          ) : (
            <UIIcon iconName="play_arrow" />
          )}
        </div>
        {imageData.images && imageData.images[0] ? (
          <img
            src={imageData.images[0].url}
            alt={imageData.alt}
            className="size-12 rounded"
          />
        ) : (
          <UIIcon iconName={isPodcast(track) ? "podcasts" : "hide_image"} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium truncate ${isCurrent ? "text-primary" : ""}`}
        >
          {track.name}
        </h4>
        {getSubtitleText()}
      </div>
      <div className="text-sm text-gray-500">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
}
