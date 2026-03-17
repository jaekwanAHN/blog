// app/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          기술 블로그
        </h1>
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block transition hover:opacity-80"
                >
                  <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {post.title}
                  </h2>
                </Link>
                <time
                  dateTime={post.date}
                  className="mb-2 block text-sm text-zinc-500 dark:text-zinc-400"
                >
                  {post.date}
                </time>
                <p className="mb-3 text-zinc-600 dark:text-zinc-300">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label="태그">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
        {posts.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">
            아직 작성된 포스트가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}
