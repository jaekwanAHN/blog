import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";

// 첫 페인트 전에 테마 클래스를 붙여, 새로고침 때 반대 테마가 번쩍이는 것을 막는다.
// 저장된 선택이 없으면 OS 설정을 따른다. 키는 components/theme-toggle.tsx와 공유한다.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "기술 블로그",
  description: "개인 기술 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 인라인 스크립트가 서버 렌더 결과에 없던 class를 붙이므로 경고를 끈다.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeToggle />
        {children}
        <Footer />
      </body>
    </html>
  );
}
