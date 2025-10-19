import React from "react";

export default function GridItemLoading() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-base-200 rounded p-2 space-y-2"
        >
          <div className="skeleton bg-base-300 w-full aspect-square rounded"></div>
          <div className="skeleton bg-base-300 h-4"></div>
        </div>
      ))}
    </>
  );
}
