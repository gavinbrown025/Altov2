import { useDashboard } from "@/contexts/DashboardContext";
import TrackListItem from "../TrackListIem";

export default function TopTracks() {
  const { topTracks } = useDashboard();

  if (topTracks.length === 0) {
    return <p>No top tracks available.</p>;
  }
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
      <div className="space-y-3">
        {topTracks.map((track, index) => (
          <TrackListItem key={track.id} track={track} index={index} />
        ))}
      </div>
    </section>
  );
}
