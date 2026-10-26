// app/page/[n]/page.tsx
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTotalPages } from "@/lib/mdx";
import { PostsPage } from "@/components/posts-page";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ n: string }>;
}

/** 2페이지부터 마지막 페이지까지 빌드 시점에 생성한다. 1페이지는 홈("/")이 담당한다. */
export function generateStaticParams() {
  const totalPages = getTotalPages();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { n } = await params;
  if (n === "1") permanentRedirect("/");
  if (!/^[1-9][0-9]*$/.test(n) || Number(n) > getTotalPages()) notFound();
  return pageMetadata(`기술 글 목록 ${n}페이지`, `React, Next.js, Supabase 문제 해결과 알고리즘 구현 기록 ${n}페이지입니다.`, `/page/${n}`);
}

export default async function PaginatedPostsPage({ params }: PageProps) {
  const { n } = await params;

  // "/page/1"은 홈과 내용이 같으므로 중복 URL을 만들지 않고 홈으로 보낸다.
  if (n === "1") {
    permanentRedirect("/");
  }

  // "02", "2abc" 같은 값이 2페이지로 통하면 같은 내용의 URL이 여러 개 생긴다.
  if (!/^[1-9][0-9]*$/.test(n)) {
    notFound();
  }

  const currentPage = Number.parseInt(n, 10);
  if (currentPage > getTotalPages()) {
    notFound();
  }

  return <PostsPage currentPage={currentPage} />;
}
