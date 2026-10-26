// app/tags/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/mdx";
import { TagLink } from "@/components/tag-link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("기술 주제별 글 모음", "React, Next.js, Supabase, JavaScript 알고리즘 등 기술 주제별 글을 찾아보세요.", "/tags");

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← 홈으로
        </Link>
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          태그
        </h1>
        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <TagLink tag={tag} count={count} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">아직 태그가 없습니다.</p>
        )}
      </main>
    </div>
  );
}
