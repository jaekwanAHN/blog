# 기술 블로그 (Next.js + MDX)

Next.js App Router와 MDX를 기반으로 만든 개인 기술 블로그 프로젝트입니다.  
`content/posts/*.mdx` 파일을 작성하면 자동으로 포스트 목록과 상세 페이지가 생성됩니다.

---

## 기술 스택

- **Framework**: Next.js 16 (App Router, TypeScript strict)
- **Runtime**: React 19
- **스타일링**: Tailwind CSS v4, `@tailwindcss/typography`
- **Markdown/MDX**:
  - `next-mdx-remote` (`next-mdx-remote/rsc`)
  - `gray-matter` (frontmatter 파싱)
  - `rehype-pretty-code` + `shiki` (코드 블록 하이라이팅)
- **언어**: TypeScript (`strict: true`)

---

## 기능 개요

- `content/posts/*.mdx`를 읽어 **블로그 포스트로 렌더링**
- 홈(`/`)에서 **포스트 목록** 표시
  - 제목, 날짜, 설명, 태그
  - 카드 전체 클릭 시 해당 포스트 상세 페이지로 이동
- `/blog/[slug]`에서 **포스트 상세 페이지** 렌더링
  - `next-mdx-remote/rsc` + `rehype-pretty-code`
  - 제목, 날짜, 태그, 본문
- MDX 본문에 대해 **커스텀 컴포넌트** 적용
  - `h1`, `h2`, `h3`, `a`, `pre`, `code`, `blockquote`
  - Tailwind `prose` 스타일 + 다크 모드 대응
  - 외부 링크 자동으로 `target="_blank" rel="noopener noreferrer"` 적용
- `generateStaticParams`, `generateMetadata`를 사용한 SSG + SEO 메타 태그

---

## 프로젝트 구조

```txt
app/
  layout.tsx           # 전역 레이아웃 및 메타데이터
  page.tsx             # 홈: 포스트 목록 페이지
  blog/
    [slug]/
      page.tsx         # 포스트 상세 페이지
components/
  mdx-components.tsx   # MDX용 커스텀 컴포넌트 맵
content/
  posts/
    ...                # 추가 포스트들
lib/
  mdx.ts               # MDX 파일 읽기/파싱 유틸
next.config.ts
postcss.config.mjs
app/globals.css        # Tailwind, typography 플러그인 및 기본 스타일
tailwind.config.*      # (v4: CSS-first 방식으로 대체)
tsconfig.json
```

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

개발 서버 실행 후 브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## MDX 포스트 작성 방법

### 1. 파일 생성

`content/posts/` 아래에 `my-post.mdx` 와 같이 파일을 생성합니다.

```md
---
title: "첫 번째 포스트"
date: "2025-03-17T14:32:05"
description: "블로그를 시작합니다."
tags: ["Next.js", "MDX"]
---

## 소개

본문 내용...

```tsx
export default function Page() {
  return <h1>Hello, World!</h1>;
}
```

> 인용구, 링크 등 다양한 마크다운/MDX 문법을 사용할 수 있습니다.
```

- **title**: 포스트 제목
- **date**: 날짜/시간 (ISO 8601, 문자열)
  - 정렬은 `date` 기준 내림차순(최신이 위)
- **description**: 목록에 보일 요약 설명
- **tags**: 태그 배열

홈 화면에서는 `date` 값을 `YYYY-MM-DD` 형식으로만 표시합니다.

### 2. 슬러그 규칙

파일 이름이 곧 `slug`가 됩니다.

- `content/posts/hello-world.mdx` → `/blog/hello-world`
- `content/posts/firstPost.mdx` → `/blog/firstPost`

---

## MDX 파이프라인 (lib/mdx.ts)

`lib/mdx.ts`는 MDX 파일을 읽고 frontmatter/본문을 파싱하는 유틸을 제공합니다.

- **getAllPosts()**
  - `content/posts/**/*.mdx` 를 모두 읽어 배열로 반환
  - `date` 내림차순으로 정렬
  - 반환 타입: `{ slug, title, date, description, tags }[]`
- **getPostBySlug(slug: string)**
  - 해당 슬러그의 파일을 찾아 frontmatter + content 반환
- **getAllSlugs()**
  - `generateStaticParams`에서 사용할 슬러그 목록
- **mdxRehypePlugins**
  - `rehype-pretty-code`를 포함하는 rehype 플러그인 설정
  - `next-mdx-remote/rsc`의 `options.mdxOptions.rehypePlugins`로 전달

---

## 페이지 설명

### 홈: `app/page.tsx`

- 서버 컴포넌트
- `getAllPosts()`로 포스트 목록을 받아와 렌더링
- 각 항목은 하나의 카드 형태이며, **카드 전체가 링크**입니다.

```tsx
<Link
  href={`/blog/${post.slug}`}
  className="block rounded-lg border ... hover:opacity-80"
>
  <article>
    <h2>...</h2>
    <time>{formatPostDate(post.date)}</time>
    <p>description</p>
    {/* tags */}
  </article>
</Link>
```

- 날짜는 `YYYY-MM-DD` 로 포맷해서 보여줍니다.

### 포스트 상세: `app/blog/[slug]/page.tsx`

- 서버 컴포넌트
- `generateStaticParams`로 모든 슬러그를 SSG
- `generateMetadata`로 title/description을 SEO 메타로 사용
- `MDXRemote` (`next-mdx-remote/rsc`)로 MDX를 렌더링

```tsx
const mdxContent = await MDXRemote({
  source: content,
  options: {
    mdxOptions: {
      rehypePlugins: mdxRehypePlugins,
    },
  },
  components: mdxComponents,
});
```

- 본문 컨테이너는 Tailwind Typography를 활용:

```tsx
<div className="prose prose-neutral dark:prose-invert max-w-none">
  {mdxContent}
</div>
```

---

## 커스텀 MDX 컴포넌트

`components/mdx-components.tsx`에서 기본 HTML 요소에 대해 커스텀 렌더러를 정의합니다.

- **h1, h2, h3**:
  - 블로그 글에 어울리는 타이포그래피, 여백 설정
- **a**:
  - 내부 링크: 기본 동작
  - 외부 링크(`http://`, `https://` 시작):
    - `target="_blank"`, `rel="noopener noreferrer"` 자동 적용
- **pre, code**:
  - `pre`: 코드 블록 컨테이너 스타일
  - `code`: 인라인 코드(`className`이 없는 경우)와 블록 코드 구분
- **blockquote**:
  - 왼쪽 보더와 약간의 이탤릭 스타일

---

## Tailwind & Typography 설정

### Tailwind v4 (CSS-first)

`app/globals.css`에서 Tailwind와 typography 플러그인을 활성화합니다.

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

Tailwind v4에서는 별도의 `tailwind.config.js` 파일 없이도  
CSS 상에서 `@plugin` 지시어로 플러그인을 등록합니다.

---

## 향후 확장 아이디어

- 카테고리/태그별 필터링 페이지
- 검색 기능 (제목/본문)
- RSS/ATOM 피드 생성
- 다국어(i18n) 지원
- 코드 테마 라이트/다크 자동 전환 (`rehype-pretty-code` 테마 분기)

---

## 라이선스

개인 학습 및 블로그 용도로 제작되었습니다.  
필요하다면 이 구조를 참고해 자유롭게 커스터마이징해 사용하셔도 좋습니다.
