import { getCurrentUserProfile, getCurrentUserPlaylists, getCurrentUserTopTracks } from "@/lib/spotify";

interface DashboardContentProps {}


export default async function DashboardContent() {
  try {
    const [profile, playlists, topTracks] = await Promise.all([
      getCurrentUserProfile(),
      getCurrentUserPlaylists(10),
      getCurrentUserTopTracks("medium_term", 10),
    ]);

    return (
      <div className="space-y-8">
        <section className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            {profile.images && profile.images[0] && (
              <img
                src={profile.images[0].url}
                alt={profile.display_name || "User"}
                className="size-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{profile.display_name}</h1>
              <p className="text-lg opacity-90">{profile.followers.total} followers</p>
              <p className="opacity-75">{profile.country} • {profile.product}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Playlists Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
            <div className="space-y-3">
              {playlists.items.map((playlist) => (
                <div key={playlist.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {playlist.images && playlist.images[0] && (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="size-12 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {playlist.tracks.total} tracks • by {playlist.owner.display_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Tracks Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
            <div className="space-y-3">
              {topTracks.items.map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-8 text-center text-lg font-bold text-gray-500">
                    {index + 1}
                  </div>
                  {track.album.images && track.album.images[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="size-12 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{track.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {track.artists.map(artist => artist.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching Spotify data:", error);

    return (
      <div className="text-center py-8">
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          <h2 className="text-xl font-semibold mb-2">Spotify Not Connected</h2>
          <p className="mb-4">
            {error instanceof Error ? error.message : "Unable to fetch your Spotify data. Please make sure you've connected your Spotify account."}
          </p>
          <p className="text-sm">
            Sign out and sign back in with Spotify to connect your account.
          </p>
        </div>
      </div>
    );
  }
}