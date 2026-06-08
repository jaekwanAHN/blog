// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Pluggable } from "unified";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs, mdxRehypePlugins } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx-components";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "포스트를 찾을 수 없습니다" };
  }
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const { frontmatter, content } = post;

  const mdxContent = await MDXRemote({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: mdxRehypePlugins as Pluggable[],
      },
    },
    components: mdxComponents,
  });

  return (
    <div className="flex-1 bg-zinc-50 font-sans dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {frontmatter.title}
          </h1>
          <time
            dateTime={frontmatter.date}
            className="block text-sm text-zinc-500 dark:text-zinc-400"
          >
            {frontmatter.date}
          </time>
          {frontmatter.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="태그">
              {frontmatter.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {mdxContent}
        </div>
      </article>
    </div>
  );
}
