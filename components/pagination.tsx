// components/pagination.tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** 목록의 기준 경로. 예: "/" → "/page/2", "/tags/react" → "/tags/react/page/2" */
  basePath?: string;
}

/**
 * page 번호를 경로로 변환한다. 쿼리스트링(`?page=2`) 대신 경로를 쓰는 이유는
 * 쿼리를 읽는 순간 페이지가 동적 렌더링으로 바뀌어 정적 생성에서 빠지기 때문이다.
 * 1페이지는 기준 경로 자체이므로 별도 URL을 만들지 않는다.
 */
function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const base = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  return `${base}/page/${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const arrowBase =
    "rounded-md border px-3 py-2 text-sm font-medium transition";
  const arrowEnabled =
    "border-zinc-200 text-zinc-600 hover:bg-white dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900";
  const arrowDisabled =
    "cursor-not-allowed border-zinc-100 text-zinc-300 dark:border-zinc-900 dark:text-zinc-700";

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="페이지네이션"
    >
      {hasPrev ? (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          rel="prev"
          className={`${arrowBase} ${arrowEnabled}`}
        >
          이전
        </Link>
      ) : (
        <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
          이전
        </span>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <Link
                href={pageHref(basePath, page)}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  "flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition " +
                  (isCurrent
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900")
                }
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      {hasNext ? (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          rel="next"
          className={`${arrowBase} ${arrowEnabled}`}
        >
          다음
        </Link>
      ) : (
        <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
          다음
        </span>
      )}
    </nav>
  );
}
