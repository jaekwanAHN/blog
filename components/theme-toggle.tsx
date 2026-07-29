// components/theme-toggle.tsx
"use client";

import { useEffect } from "react";

/** 사용자가 직접 고른 테마를 저장하는 localStorage 키. app/layout.tsx의 인라인 스크립트와 공유한다. */
const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  useEffect(() => {
    // 사용자가 아직 직접 고르지 않았다면 OS 설정 변경을 그대로 따라간다.
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        // localStorage를 못 읽는 환경(시크릿 모드 등)에서는 OS 설정을 따른다.
      }
      applyTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleToggle = () => {
    // 서버 렌더 결과와 어긋나지 않도록 현재 테마는 상태가 아니라 DOM에서 읽는다.
    const next: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 저장에 실패해도 이번 방문 동안의 전환은 그대로 유지된다.
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="라이트 모드와 다크 모드 전환"
      title="라이트 모드와 다크 모드 전환"
      className={
        className ??
        "fixed right-4 top-4 z-50 rounded-full border border-zinc-200 bg-white/80 p-2.5 text-zinc-600 shadow-sm backdrop-blur transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 sm:right-6 sm:top-6 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      }
    >
      {/*
       * 아이콘은 상태 대신 CSS로 바꾼다. 서버는 현재 테마를 알 수 없으므로
       * 상태로 렌더하면 하이드레이션 불일치와 아이콘 깜빡임이 생긴다.
       */}
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </button>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
