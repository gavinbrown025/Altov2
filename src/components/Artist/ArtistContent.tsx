"use client";

import { useEffect, useState } from "react";
import { SpotifyArtist, SpotifyTrack, SpotifyAlbum } from "@/types/spotify";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";

import ArtistCard from "./ArtistCard";
import TrackList from "@/components/TrackList";
import ItemGrid from "../ItemGrid";

export default function ArtistContent({ params }: { params: { id: string } }) {
  const artistId = params.id;
  console.log(artistId);

  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  const { getArtist, getArtistTopTracks, getArtistAlbums } = useSpotifyApi();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);

        // Fetch artist info and top tracks in parallel
        const [artistData, topTracksData, albumsData] = await Promise.all([
          getArtist(artistId),
          getArtistTopTracks(artistId),
          getArtistAlbums(artistId),
        ]);

        console.log(albumsData);

        setArtist(artistData);
        setTopTracks(topTracksData.tracks);
        setAlbums(albumsData.items);
      } catch (error) {
        console.error("Failed to fetch artist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (!loading && !artist) {
    return <div className="p-8">Artist not found</div>;
  }

  return (
    <div className="space-y-12">
      <ArtistCard artist={artist} loading={loading} />
      <section>
        <TrackList loading={loading} title="Top Tracks" tracks={topTracks} />
        <span className="divider" />
        <ItemGrid
          loading={loading}
          title="Discography"
          link="/album"
          items={albums}
        />
      </section>
    </div>
  );
}
