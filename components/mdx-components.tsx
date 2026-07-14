// components/mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import { MdxImage } from "@/components/mdx-image";

function isExternal(href: string): boolean {
  if (typeof href !== "string" || !href) return false;
  return href.startsWith("http://") || href.startsWith("https://");
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="mb-4 mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-3 mt-8 border-b border-zinc-200 pb-2 text-2xl font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-2 mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
      {...props}
    >
      {children}
    </h3>
  ),
  a: ({ href, children, ...props }) => {
    const external = typeof href === "string" && isExternal(href);
    return (
      <a
        href={href}
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    // rehype-pretty-code는 블럭 코드에 className 대신 data-language 속성을 붙인다.
    // className(language-*) 체크는 highlighter를 거치지 않은 블럭 코드 대비 보조 조건.
    const isBlock =
      "data-language" in props || /\blanguage-/.test(className ?? "");
    if (!isBlock) {
      return (
        <code
          className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-700"
          {...props}
        >
          {children}
        </code>
      );
    }
    // w-max: 가장 긴 라인 폭만큼 늘어나 스크롤 끝까지 배경/하이라이트 유지
    // min-w-full: 짧은 코드일 때 pre 폭을 채움
    return (
      <code className={`w-max min-w-full ${className ?? ""}`} {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  img: (props) => <MdxImage {...props} />,
};
