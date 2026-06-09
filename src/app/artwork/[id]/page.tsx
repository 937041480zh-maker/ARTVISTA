import WorkDetailClient from "@/components/artwork/WorkDetailClient";

export default function ArtworkPage({
  params,
}: {
  params: { id: string };
}) {
  return <WorkDetailClient id={params.id} />;
}
