import { readFile, readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import matter from "gray-matter";

const output = path.resolve("public/social");
const font = await readFile("assets/fonts/NanumGothic-Bold.ttf");
const cards = [{ slug: "index", title: "안재관 기술 블로그", label: "CODE · DEBUG · LEARN", tags: ["React", "Next.js", "JavaScript", "Supabase"] }];
for (const file of (await readdir("content/posts")).filter((file) => /\.mdx?$/.test(file)).sort()) {
  const { data } = matter(await readFile(path.join("content/posts", file), "utf8"));
  if (data.draft) continue;
  if (typeof data.title !== "string" || !data.title.trim()) throw new Error(`${file}: missing title`);
  cards.push({ slug: `posts/${file.replace(/\.mdx?$/, "")}`, title: data.title, label: "안재관 기술 블로그", tags: (data.tags ?? []).slice(0, 4) });
}

// This directory contains only generated assets; remove images for deleted/draft posts.
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "posts"), { recursive: true });
for (const card of cards) {
  const response = new ImageResponse(
    h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#101820", color: "#f4f4f5", padding: "58px 68px", fontFamily: "Nanum Gothic", fontWeight: 700, borderTop: "12px solid #68dfb5" } },
      h("div", { style: { display: "flex", color: "#68dfb5", fontSize: 25, letterSpacing: 2 } }, card.label),
      h("div", { style: { display: "flex", flex: 1, alignItems: "center", fontSize: card.title.length > 65 ? 46 : card.title.length > 45 ? 52 : 62, lineHeight: 1.35, wordBreak: "keep-all", overflowWrap: "break-word" } }, card.title),
      h("div", { style: { display: "flex", gap: 16, fontSize: 21, color: "#b2c5cd" } },
        ...card.tags.map((tag) => h("span", { key: tag }, tag))),
      h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 30, borderTop: "1px solid #38454e", paddingTop: 24, fontSize: 20 } },
        h("span", null, "AhnJaeKwan"), h("span", { style: { color: "#b2c5cd" } }, "ajkblog.vercel.app"))),
    { width: 1200, height: 630, fonts: [{ name: "Nanum Gothic", data: font, weight: 700, style: "normal" }] },
  );
  await writeFile(path.join(output, `${card.slug}.png`), Buffer.from(await response.arrayBuffer()));
}
console.log(`Generated ${cards.length} social preview images (1200×630).`);
