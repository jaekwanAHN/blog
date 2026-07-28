// lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export const POSTS_PER_PAGE = 10;

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

/**
 * 목록을 그릴 때마다 전체 포스트를 다시 읽지 않도록 모듈 스코프에 캐싱한다.
 * 빌드·프로덕션에서는 콘텐츠가 바뀌지 않으므로 프로세스 생존 동안 유효하다.
 * dev에서는 mdx를 추가·수정해도 즉시 반영돼야 하므로 캐시를 쓰지 않는다.
 */
let postsCache: PostMeta[] | null = null;
const useCache = process.env.NODE_ENV !== "development";

/** 캐시된 배열을 그대로 돌려주므로 호출부에서 변형하지 말 것 (slice/filter로 새 배열을 만들 것). */
export function getAllPosts(): PostMeta[] {
  if (useCache && postsCache) {
    return postsCache;
  }
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
  posts.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
  if (useCache) {
    postsCache = posts;
  }
  return posts;
}

/** 전체 포스트를 POSTS_PER_PAGE로 나눈 페이지 수. 포스트가 없어도 최소 1이다. */
export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}

export interface TagCount {
  tag: string;
  count: number;
}

export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
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

/**
 * MDX는 CommonMark + JSX라서 표·취소선·체크박스·각주 같은 GFM 확장 문법을
 * 기본으로 이해하지 못한다. remark-gfm이 없으면 표가 문단 텍스트로 렌더링된다.
 */
export const mdxRemarkPlugins = [remarkGfm];

export const mdxRehypePlugins = [
  [
    rehypePrettyCode,
    {
      theme: "github-dark",
      keepBackground: false,
    },
  ],
];
