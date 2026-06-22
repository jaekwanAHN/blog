// components/tag-link.tsx
import Link from "next/link";

interface TagLinkProps {
  tag: string;
  count?: number;
}

export function TagLink({ tag, count }: TagLinkProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
    >
      {tag}
      {typeof count === "number" && (
        <span className="text-zinc-500 dark:text-zinc-400">{count}</span>
      )}
    </Link>
  );
}
