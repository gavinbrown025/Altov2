import Link from "next/link";
import { SpotifyAlbum, SpotifyPlaylist } from "@/types/spotify";
import GridItemLoading from "./Loading/GridItemLoading";

// SpotifyCategory as a type for the items prop in the future

interface ItemGridProps {
  loading?: boolean;
  title: string;
  link: string;
  items: (SpotifyAlbum | SpotifyPlaylist)[];
}

export default function ItemGrid({
  loading,
  title,
  link,
  items,
}: ItemGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
      <h3 className="col-span-full text-xl font-bold mb-4">{title}</h3>
      {loading ? (
        <GridItemLoading />
      ) : (
        items.map((item) => (
          <Link
            href={`${link}/${item.id}`}
            key={item.id}
            className="hover:shadow-lg hover:bg-base-300 p-2 space-y-2"
          >
            <img
              src={item.images[0]?.url}
              alt={item.name}
              className="rounded-sm"
            />
            <h4 className="text-sm font-semibold line-clamp-2">{item.name}</h4>
          </Link>
        ))
      )}
    </div>
  );
}
