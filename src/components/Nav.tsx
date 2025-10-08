import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import SpotifySearch from "@/components/SpotifySearch";
import UIIcon from "./UIIcon";

export default function Nav({ className }: { className?: string }) {
  return (
    <div className={`bg-base-200 px-4 sm:px-6 lg:px-8 ${className}`}>
      <nav className="flex items-center justify-between gap-4 py-4">
        <div className="logo">
          <UIIcon iconName="music_cast" />
          ALTO
          </div>
        <SignedOut>
          <div className="self-end">
            <SignInButton>
              <button className="btn btn-outline mr-6">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="btn btn-accent">Sign Up</button>
            </SignUpButton>
          </div>
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
