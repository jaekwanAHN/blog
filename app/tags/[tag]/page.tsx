// app/tags/[tag]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import { PostList } from "@/components/post-list";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `'${decoded}' 태그가 달린 글 모음`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/tags"
          className="mb-8 inline-block text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← 전체 태그
        </Link>
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          #{decoded}
        </h1>
        <p className="mb-12 text-sm text-zinc-500 dark:text-zinc-400">
          {posts.length}개의 글
        </p>
        <PostList posts={posts} />
      </main>
    </div>
  );
}
