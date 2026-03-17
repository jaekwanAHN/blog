import type { NextConfig } from "next";

// MDX 파싱 및 rehype-pretty-code 플러그인은 next-mdx-remote 사용으로
// lib/mdx.ts (mdxRehypePlugins) 및 app/blog/[slug]/page.tsx에서 적용됨
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
