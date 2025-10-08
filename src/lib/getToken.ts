import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getSpotifyToken(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const client = await clerkClient();
  const tokenResponse = await client.users.getUserOauthAccessToken(userId, "spotify");

  if (tokenResponse.data.length === 0) {
    throw new Error("No Spotify connection found. Please sign in with Spotify.");
  }

  return tokenResponse.data[0].token;
}

