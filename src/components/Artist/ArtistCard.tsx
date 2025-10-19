import React from "react";
import UIIcon from "../UIIcon";
import { SpotifyArtist } from "@/types/spotify";

export default function ArtistCard({
  loading,
  artist,
}: {
  artist: SpotifyArtist;
  loading?: boolean;
}) {
  return loading ? (
    <div className="skeleton bg-base-300 h-[30vh] w-full p-6 flex flex-col justify-end">
      <div className="skeleton bg-black/30 h-8 w-64 rounded mb-2" />
      <div className="skeleton bg-black/30 h-5 w-32 rounded" />
    </div>
  ) : (
    <header className="h-[30vh] relative rounded-lg bg-base-300 overflow-hidden">
      {artist.images?.[0] && (
        <img
          src={artist.images[0].url}
          alt={artist.name}
          className="size-full object-cover [object-position:0%_30%]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold">{artist.name}</h2>
          <UIIcon iconName="verified" />
        </div>
        <p className=" text-gray-400">{artist.followers?.total} followers</p>
      </div>
    </header>
  );
}
