import ArtistContent from "@/components/Artist/ArtistContent";

export default async function Artist({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ArtistContent params={resolvedParams} />;
}
