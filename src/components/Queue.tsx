import React from "react";
import type { SpotifyTrack } from "@/types/spotify";

interface QueueItem {
  track: SpotifyTrack;
  uri: string;
  id: string;
}

interface QueueProps {
  queue: QueueItem[];
  currentIndex: number;
  onReorder: (startIndex: number, endIndex: number) => void;
  onRemove: (itemId: string) => void;
  onSkipTo: (itemId: string) => void;
  className?: string;
}

export default function Queue({
  queue,
  currentIndex,
  onReorder,
  onRemove,
  onSkipTo,
  className,
}: QueueProps) {
  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null) {
      onReorder(draggedItem, dropIndex);
      setDraggedItem(null);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (queue.length === 0) {
    return (
      <div className={`p-6 text-center opacity-50 ${className}`}>
        <div className="text-lg mb-2">No tracks in queue</div>
        <div className="text-sm">Add some music to get started!</div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-semibold">Queue</h2>
        <div className="text-sm opacity-70">
          {queue.length} track{queue.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {queue.map((item, index) => {
          const isCurrentTrack = index === currentIndex;
          const isPlayed = index < currentIndex;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                flex items-center p-3 border-b border-base-200 cursor-move
                hover:bg-base-200 transition-colors
                ${isCurrentTrack ? 'bg-primary/10 border-primary/20' : ''}
                ${isPlayed ? 'opacity-60' : ''}
                ${draggedItem === index ? 'opacity-50' : ''}
              `}
            >
              {/* Drag Handle */}
              <div className="text-base-content/40 mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1-.001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1-.001 4.001A2 2 0 0 1 13 14z"></path>
                </svg>
              </div>

              {/* Track Number */}
              <div className={`w-8 text-sm font-mono ${isCurrentTrack ? 'text-primary' : 'text-base-content/60'}`}>
                {isCurrentTrack ? '▶' : index + 1}
              </div>

              {/* Album Art */}
              <div className="w-12 h-12 mr-3 flex-shrink-0">
                <img
                  src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
                  alt={item.track.album.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Track Info */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onSkipTo(item.id)}
              >
                <div className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>
                  {item.track.name}
                </div>
                <div className="text-sm text-base-content/60 truncate">
                  {item.track.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>

              {/* Duration */}
              <div className="text-sm text-base-content/60 mx-3">
                {formatDuration(item.track.duration_ms)}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="p-1 rounded hover:bg-base-300 text-base-content/40 hover:text-error transition-colors"
                title="Remove from queue"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Queue Summary */}
      <div className="p-4 border-t border-base-200 bg-base-100">
        <div className="text-sm text-base-content/60">
          Total duration: {formatDuration(
            queue.reduce((total, item) => total + item.track.duration_ms, 0)
          )}
        </div>
      </div>
    </div>
  );
}