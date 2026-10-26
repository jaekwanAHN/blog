import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getTotalPages } from "@/lib/mdx";
import { SITE_URL, articleDate } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/tags` },
    ...Array.from({ length: getTotalPages() - 1 }, (_, i) => ({ url: `${SITE_URL}/page/${i + 2}` })),
    ...getAllTags().map(({ tag }) => ({ url: `${SITE_URL}/tags/${encodeURIComponent(tag)}` })),
    ...getAllPosts().filter((post) => !post.noindex).map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: articleDate(post.updatedAt ?? post.date),
    })),
  ];
}
