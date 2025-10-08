import { NextRequest, NextResponse } from "next/server";
import { getSpotifyToken } from "@/lib/getToken";

// Simple API route that proxies Spotify requests with automatic token handling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  try {
    const token = await getSpotifyToken();
    const spotifyResponse = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Spotify API error" },
        { status: spotifyResponse.status }
      );
    }

    const data = await spotifyResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in Spotify proxy:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}