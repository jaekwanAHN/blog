// lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface PostBySlug {
  frontmatter: PostFrontmatter;
  content: string;
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  const posts: PostMeta[] = filenames.map((filename) => {
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);
    const slug = getSlugFromFilename(filename);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    };
  });
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

export function getPostBySlug(slug: string): PostBySlug | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  let fullPath: string;
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else {
    return null;
  }
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: {
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    },
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => getSlugFromFilename(f));
}

export const mdxRehypePlugins = [
  [
    rehypePrettyCode,
    {
      theme: "github-dark",
      keepBackground: false,
    },
  ],
];
