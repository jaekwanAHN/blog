"use client";

import { useCallback, useEffect, useState } from "react";

type MdxImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MdxImage({ alt, src, className, ...props }: MdxImageProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!src || typeof src !== "string") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative my-4 block w-full max-w-full cursor-zoom-in text-left"
        aria-label={
          alt
            ? `${alt} — 클릭하여 원본 크기로 보기`
            : "이미지를 클릭하여 원본 크기로 보기"
        }
      >
        <span className="pointer-events-none absolute right-2 top-2 z-1 rounded bg-black/55 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
          클릭하여 확대
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt ?? ""}
          src={src}
          className="h-auto w-full max-w-full rounded-lg border border-zinc-200 object-contain dark:border-zinc-700"
          loading="lazy"
          decoding="async"
          {...props}
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-100 overflow-auto bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="이미지 원본 보기"
          onClick={close}
        >
          <div
            className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8"
            onClick={close}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={alt ?? ""}
              src={src}
              className="max-h-none max-w-none"
              decoding="async"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            type="button"
            className="fixed right-4 top-4 z-101 rounded-full bg-white/15 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/25"
            onClick={close}
            aria-label="닫기"
          >
            닫기 · Esc
          </button>
        </div>
      ) : null}
    </>
  );
}
