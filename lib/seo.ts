import type { Metadata } from "next";

export const SITE_URL = "https://ajkblog.vercel.app";
export const SITE_NAME = "안재관 기술 블로그";
export const SITE_DESCRIPTION =
  "React, Next.js, Supabase의 오류 해결과 성능 개선, JavaScript 알고리즘 구현을 실제 코드와 측정 결과로 정리합니다.";
export const AUTHOR = { name: "AhnJaeKwan", url: "https://github.com/jaekwanAHN" };

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: "ko_KR", type: "website" },
    twitter: { card: "summary", title, description },
  };
}

// 기존 글의 시간대 없는 일시는 한국 표준시로 해석한다.
export function articleDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+09:00`;
}
