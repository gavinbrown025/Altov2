import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import SpotifySearch from "@/components/SpotifySearch";

export default function Nav({ className }: { className?: string }) {
  return (
    <div className={`bg-base-200 px-4 sm:px-6 lg:px-8 ${className}`}>
      <nav className="flex items-center justify-between gap-4 py-4">
        <div className="logo">ALTO</div>

        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-accent text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <SpotifySearch />
          <div className="flex justify-end">
            <UserButton />
          </div>
        </SignedIn>
      </nav>
    </div>
  );
}
