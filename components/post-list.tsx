// components/post-list.tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { TagLink } from "@/components/tag-link";

function formatPostDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface PostListProps {
  posts: PostMeta[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="space-y-10">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <article>
            <Link
              href={`/blog/${post.slug}`}
              className="block transition hover:opacity-80"
            >
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {post.title}
              </h2>
              <time
                dateTime={post.date}
                className="mb-2 block text-sm text-zinc-500 dark:text-zinc-400"
              >
                {formatPostDate(post.date)}
              </time>
              <p className="mb-3 text-zinc-600 dark:text-zinc-300">
                {post.description}
              </p>
            </Link>
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="태그">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagLink tag={tag} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
