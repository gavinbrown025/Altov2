import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import TrackListItem from "../TrackListIem";

export default function Recommendations() {
  const { recommendations } = useDashboard();

  if (recommendations.length === 0) {
    console.log(recommendations);
    return <p>No recommendations available.</p>;
  }
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((track, index) => (
          <TrackListItem key={index} track={track} index={index} />
        ))}
      </div>
    </section>
  );
}
