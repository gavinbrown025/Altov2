import { useDashboard } from "@/contexts/DashboardContext";
export default function UserCard({ className }: { className?: string }) {
  const { user } = useDashboard();
  if (!user) return null;

  return (
    <section className={`rounded-lg p-6 text-white ${className}`}>
      <div className="flex items-center space-x-4">
        {user.images && user.images[0] && (
          <img
            src={user.images[0].url}
            alt={user.display_name || "User"}
            className="size-20 rounded-full"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.display_name}</h1>
          <p className="text-lg opacity-90">
            {user.followers?.total} followers
          </p>
          <p className="opacity-75">
            {user.country} • {user.product}
          </p>
        </div>
      </div>
    </section>
  );
}
