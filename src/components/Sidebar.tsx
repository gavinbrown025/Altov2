import React from "react";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`bg-base-200 text-white p-4 w-min ${className}`}>
      <nav className="space-y-2">
        <a href="/" className="block p-2 hover:bg-gray-700 rounded">
          Home
        </a>
        <a href="/search" className="block p-2 hover:bg-gray-700 rounded">
          Search
        </a>
        <a href="/queue" className="block p-2 hover:bg-gray-700 rounded">
          Queue
        </a>
      </nav>
    </aside>
  );
}
