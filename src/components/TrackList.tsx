import TrackListItem from "@/components/TrackListIem";
import TrackLoading from "./Loading/TrackLoading";
import { SpotifyEpisode, SpotifyTrack } from "@/types/spotify";

export default function TrackList({
  title,
  loading,
  tracks,
}: {
  title: string;
  loading?: boolean;
  tracks: SpotifyTrack[] | SpotifyEpisode[];
}) {
  if (!loading && tracks.length === 0) {
    return <p>No Data Available</p>;
  }
  return (
    <section>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {loading ? (
          <TrackLoading length={5} />
        ) : (
          tracks.map((track, index) => (
            <TrackListItem key={track.id} track={track} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
