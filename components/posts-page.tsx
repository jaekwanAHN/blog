// components/posts-page.tsx
import Link from "next/link";
import { getAllPosts, getAllTags, getTotalPages, POSTS_PER_PAGE } from "@/lib/mdx";
import { PostList } from "@/components/post-list";
import { Pagination } from "@/components/pagination";
import { TagLink } from "@/components/tag-link";

interface PostsPageProps {
  /** 1부터 시작하는 페이지 번호. 호출부에서 유효한 범위임을 보장한다. */
  currentPage: number;
}

/** 홈("/")과 "/page/[n]"이 공유하는 포스트 목록 화면. */
export function PostsPage({ currentPage }: PostsPageProps) {
  const posts = getAllPosts();
  const tags = getAllTags();
  const totalPages = getTotalPages();

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagedPosts = posts.slice(start, start + POSTS_PER_PAGE);

  return (
    <div className="flex-1 bg-zinc-50 font-sans dark:bg-zinc-950">
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
          <>
            <PostList posts={pagedPosts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">
            아직 작성된 포스트가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}
