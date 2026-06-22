// app/page.tsx
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { PostList } from "@/components/post-list";
import { TagLink } from "@/components/tag-link";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          기술 블로그
        </h1>
        {tags.length > 0 && (
          <section className="mb-12" aria-label="태그 모음">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                태그
              </h2>
              <Link
                href="/tags"
                className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
              >
                전체 보기
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2">
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <TagLink tag={tag} count={count} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">
            아직 작성된 포스트가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}
