/**
 * npm run validate-content
 *
 * Validates every file in content/ against its schema, plus cross-file checks
 * (duplicate slugs, broken links and references, missing images). Exits non-zero on
 * any error, so `npm run build` (which runs this first) fails on invalid content.
 */
import path from "node:path";
import { loadContent } from "../src/lib/content/load";
import { publish } from "../src/lib/content/visibility";

const root = process.cwd();
const { tree, issues } = loadContent({
  contentRoot: path.join(root, "content"),
  publicDir: path.join(root, "public"),
});

const useColor = process.stdout.isTTY;
const paint = (code: number, text: string) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);
const red = (t: string) => paint(31, t);
const yellow = (t: string) => paint(33, t);
const green = (t: string) => paint(32, t);
const bold = (t: string) => paint(1, t);
const dim = (t: string) => paint(2, t);

const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

const files = [...new Set(issues.map((i) => i.file))];
for (const file of files) {
  console.log(`\n${bold(file)}`);
  for (const issue of issues.filter((i) => i.file === file)) {
    const mark = issue.severity === "error" ? red("✖ error  ") : yellow("⚠ warning");
    console.log(`  ${mark} ${issue.field ? dim(`${issue.field}: `) : ""}${issue.message}`);
  }
}

if (tree) {
  const live = publish(tree);
  console.log(
    dim(
      `\nChecked ${tree.categories.length} categories, ${tree.destinations.length} destinations, ` +
        `${tree.packages.length} packages, ${tree.reviews.length} reviews, ${tree.pages.length} pages ` +
        `(${live.packages.length} packages published).`,
    ),
  );
}

if (errors.length) {
  console.log(red(bold(`\n✖ ${errors.length} error(s)`)) + (warnings.length ? yellow(`, ${warnings.length} warning(s)`) : ""));
  console.log(dim("Fix the errors above, then run `npm run validate-content` again. See docs/CONTENT_GUIDE.md.\n"));
  process.exit(1);
}

console.log(green(bold("\n✔ Content is valid")) + (warnings.length ? yellow(` (${warnings.length} warning(s))`) : "") + "\n");
