import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import Notes from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] || "all";
  const displayTag = tag === "all" ? "All notes" : tag;

  return {
    title: `${displayTag} | NoteHub`,
    description: `Перегляд нотаток з фільтром: ${displayTag}`,
    openGraph: {
      title: `${displayTag} | NoteHub`,
      description: `Перегляд нотаток з фільтром: ${displayTag}`,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug[0] || "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes({ search: "", page: 1, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
