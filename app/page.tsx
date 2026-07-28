// app/page.tsx
import { PostsPage } from "@/components/posts-page";

// searchParams를 읽지 않으므로 이 페이지는 빌드 시점에 정적으로 생성된다.
// 2페이지부터는 app/page/[n]/page.tsx가 담당한다.
export default function Home() {
  return <PostsPage currentPage={1} />;
}
