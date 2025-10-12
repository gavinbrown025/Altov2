import { NextRequest, NextResponse } from "next/server";
import { getSpotifyToken } from "@/lib/getToken";

// Simple API route that proxies Spotify requests with automatic token handling
async function handleSpotifyRequest(request: NextRequest, method: string) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  try {
    const token = await getSpotifyToken();

    // Get request body for PUT/POST requests
    const body = ['PUT', 'POST'].includes(method) ? await request.text() : undefined;

    const spotifyResponse = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body && { body }),
    });

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Spotify API error" },
        { status: spotifyResponse.status }
      );
    }

    // Some Spotify endpoints return empty responses for successful operations
    const contentType = spotifyResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await spotifyResponse.json();
      return NextResponse.json(data);
    } else {
      return new NextResponse(null, { status: 200 });
    }

  } catch (error) {
    console.error("Error in Spotify proxy:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleSpotifyRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
  return handleSpotifyRequest(request, 'PUT');
}

export async function POST(request: NextRequest) {
  return handleSpotifyRequest(request, 'POST');
}