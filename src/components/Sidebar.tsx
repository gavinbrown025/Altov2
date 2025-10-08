import Link from "next/link";
import UIIcon from "./UIIcon";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`bg-base-200 text-nowrap p-4 w-min ${className}`}>
      <nav className="space-y-2">
        <Link href="/" className="flex items-center gap-2 py-2 px-6 hover:bg-base-300 rounded">
         <UIIcon iconName="home" /> Home
        </Link>
        <Link href="/search" className="flex items-center gap-2 py-2 px-6 hover:bg-base-300 rounded">
          <UIIcon iconName="search" /> Search
        </Link>
        <Link href="/queue" className="flex items-center gap-2 py-2 px-6 hover:bg-base-300 rounded">
          <UIIcon iconName="queue" /> Queue
        </Link>
      </nav>
    </aside>
  );
}
