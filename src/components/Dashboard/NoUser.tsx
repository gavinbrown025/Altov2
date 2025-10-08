export default function NoUser({error }: {error?: unknown}) {
  return (
    <div className="text-center py-8">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <h2 className="text-xl font-semibold mb-2">Spotify Not Connected</h2>
        <p className="mb-4">
          {error instanceof Error
            ? error.message
            : "Unable to fetch your Spotify data. Please make sure you've connected your Spotify account."}
        </p>
        <p className="text-sm">
          Sign out and sign back in with Spotify to connect your account.
        </p>
        <a href="/" className="btn">
          Reload
        </a>
      </div>
    </div>
  );
}
