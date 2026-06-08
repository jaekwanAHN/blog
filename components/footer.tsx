// components/footer.tsx
import Link from "next/link";
import { EmailCopyButton } from "@/components/email-copy-button";

const email = "ggstork@gmail.com";

const links = [
  { label: "GitHub", href: "https://github.com/jaekwanAHN" },
  { label: "이력서", href: "https://ajk-resume.vercel.app/" },
];

const linkClassName =
  "text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {year} AhnJaeKwan. All rights reserved.
        </p>
        <nav aria-label="외부 링크">
          <ul className="flex flex-wrap gap-4">
            <li>
              <EmailCopyButton email={email} className={linkClassName} />
            </li>
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
