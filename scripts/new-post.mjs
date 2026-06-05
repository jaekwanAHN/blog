import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, "../content/_templates/post.mdx");
const postsDir = path.join(__dirname, "../content/posts");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run new:post -- <slug>");
  console.error("Example: npm run new:post -- react-batching");
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${slug}.mdx`;
const dest = path.join(postsDir, filename);

if (fs.existsSync(dest)) {
  console.error(`Already exists: content/posts/${filename}`);
  process.exit(1);
}

const title = slug.replace(/-/g, " ");
const template = fs.readFileSync(templatePath, "utf-8").replaceAll("{{DATE}}", date)
  .replaceAll("{{TITLE}}", title)
  .replaceAll("{{DESCRIPTION}}", "")
  .replaceAll("{{TAG}}", "");

fs.writeFileSync(dest, template, "utf-8");
console.log(`Created: content/posts/${filename}`);
