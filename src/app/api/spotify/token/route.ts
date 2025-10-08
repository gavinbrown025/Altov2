import { NextResponse } from "next/server";
import { getSpotifyToken } from "@/lib/getToken";

// Dedicated endpoint for getting Spotify access token (for Web Playback SDK)
export async function GET() {
  try {
    const token = await getSpotifyToken();
    return NextResponse.json({ access_token: token });
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get token" },
      { status: 500 }
    );
  }
}
