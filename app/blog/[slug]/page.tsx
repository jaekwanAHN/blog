// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Pluggable } from "unified";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getPostBySlug,
  getAllSlugs,
  mdxRemarkPlugins,
  mdxRehypePlugins,
  getRelatedPosts,
} from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx-components";
import { TagLink } from "@/components/tag-link";
import Link from "next/link";
import { PostList } from "@/components/post-list";
import { articleDate, AUTHOR, pageMetadata, SITE_URL } from "@/lib/seo";

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
    notFound();
  }
  const { frontmatter } = post;
  const metadata = pageMetadata(frontmatter.title, frontmatter.description, `/blog/${slug}`);
  return {
    ...metadata,
    robots: frontmatter.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: articleDate(frontmatter.date),
      modifiedTime: frontmatter.updatedAt ? articleDate(frontmatter.updatedAt) : undefined,
      authors: [AUTHOR.url],
      tags: frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const { frontmatter, content } = post;
  const relatedPosts = getRelatedPosts(slug, frontmatter.tags);
  const url = `${SITE_URL}/blog/${slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: frontmatter.title,
    description: frontmatter.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "ko-KR",
    datePublished: articleDate(frontmatter.date),
    dateModified: frontmatter.updatedAt ? articleDate(frontmatter.updatedAt) : undefined,
    author: { "@type": "Person", ...AUTHOR },
  };

  const mdxContent = await MDXRemote({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: mdxRemarkPlugins as Pluggable[],
        rehypePlugins: mdxRehypePlugins as Pluggable[],
      },
    },
    components: mdxComponents,
  });

  return (
    <div className="flex-1 bg-zinc-50 font-sans dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <nav aria-label="현재 위치" className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="underline underline-offset-4">홈</Link>
          <span> / 기술 글</span>
        </nav>
        <header className="mb-10">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {frontmatter.title}
          </h1>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">{frontmatter.description}</p>
          <a href={AUTHOR.url} className="text-sm underline underline-offset-4">{AUTHOR.name}</a>
          <time
            dateTime={articleDate(frontmatter.date)}
            className="block text-sm text-zinc-500 dark:text-zinc-400"
          >
            {frontmatter.date}
          </time>
          {frontmatter.updatedAt && <p className="text-sm text-zinc-500">수정: <time dateTime={articleDate(frontmatter.updatedAt)}>{frontmatter.updatedAt}</time></p>}
          {frontmatter.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="태그">
              {frontmatter.tags.map((tag) => (
                <li key={tag}>
                  <TagLink tag={tag} />
                </li>
              ))}
            </ul>
          )}
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {mdxContent}
        </div>
        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-posts" className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-700">
            <h2 id="related-posts" className="mb-6 text-2xl font-semibold">함께 읽으면 좋은 글</h2>
            <PostList posts={relatedPosts} />
          </section>
        )}
      </article>
    </div>
  );
}
