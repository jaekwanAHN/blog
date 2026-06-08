// components/email-copy-button.tsx
"use client";

import { useState } from "react";

type EmailCopyButtonProps = {
  email: string;
  className?: string;
};

export function EmailCopyButton({ email, className }: EmailCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // 클립보드 API를 쓸 수 없는 환경(예: HTTP, 구형 브라우저) 폴백
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label={`이메일 주소 ${email} 복사`}
    >
      {copied ? "복사됨!" : "Email"}
    </button>
  );
}
