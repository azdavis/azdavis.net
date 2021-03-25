const { minify } = require("html-minifier");
const { promisify } = require("util");
const { Remarkable } = require("remarkable");
const fs = require("fs");
const glob = require("fast-glob");
const hl = require("highlight.js");
const matter = require("gray-matter");
const path = require("path");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);

function highlight(code, language) {
  if (hl.getLanguage(language)) {
    return hl.highlight(code, { language }).value;
  } else {
    return "";
  }
}

const markdown = new Remarkable({ highlight });
const options = { collapseWhitespace: true };

function page(data, content) {
  const s = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="the personal website of azdavis" />
    <title>${data.title}</title>
    <link rel="icon" href="/favicon.png" />
    <link rel="stylesheet" href="/base.css" />
    <link rel="stylesheet" href="/code.css" />
  </head>
  <body>
    <a href="/">azdavis.xyz</a>
    <h1>${data.title}</h1>
    ${markdown.render(content)}
  </body>
</html>
`;
  return minify(s, options);
}

const outRoot = path.join("src", "posts");
const recursive = { recursive: true };
const flags = { flag: "w" };
const postsData = { title: "All posts" };

async function handleOne(entry) {
  const { data, content } = matter((await readFile(entry)).toString());
  const slug = path.basename(entry, ".md");
  const dir = path.join(outRoot, slug);
  await mkdir(dir);
  await writeFile(path.join(dir, "index.html"), page(data, content), flags);
  return { title: data.title, date: data.date, slug };
}

function dateCmp({ date: a }, { date: b }) {
  return a == b ? 0 : a < b ? -1 : 1;
}

async function main() {
  await rmdir(outRoot, recursive);
  await mkdir(outRoot);
  const entries = await Promise.all((await glob("posts/*.md")).map(handleOne));
  entries.sort(dateCmp);
  const content = entries
    .map(({ title, slug }) => `- [${title}](/posts/${slug})`)
    .join("\n");
  await writeFile(path.join(outRoot, "index.html"), page(postsData, content));
}

main().catch(console.error);
