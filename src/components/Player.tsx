import React from "react";

export default function Player({ className }: { className?: string }) {
  return (
    <div className={`bg-base-300 p-4 ${className}`}>
      <div className="text-center">Player Component</div>
    </div>
  );
}
