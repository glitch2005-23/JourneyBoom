/**
 * Runs automatically after `next build`.
 *
 * Next.js requests client-navigation segment files with dot-joined names
 * (e.g. "__next.$d$category.$d$destination.__PAGE__.txt"). When building on Windows the
 * exporter writes them as nested folders instead ("__next.$d$category/$d$destination/__PAGE__.txt"),
 * so prefetches 404 and navigation falls back to full page loads. This flattens any such
 * folders into the expected file names. It is a no-op when the export is already flat (Linux/macOS).
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

function filesUnder(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(abs) : [abs];
  });
}

function walk(dir: string, onSegmentDir: (abs: string) => void) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const abs = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) onSegmentDir(abs);
    else walk(abs, onSegmentDir);
  }
}

if (!fs.existsSync(outDir)) {
  console.error('No "out" directory — run `next build` first.');
  process.exit(1);
}

let fixed = 0;
walk(outDir, (segmentDir) => {
  const parent = path.dirname(segmentDir);
  for (const file of filesUnder(segmentDir)) {
    const flatName = path.relative(parent, file).split(path.sep).join(".");
    const target = path.join(parent, flatName);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(file, target);
      fixed++;
    }
  }
  fs.rmSync(segmentDir, { recursive: true, force: true });
});

console.log(fixed ? `Export: flattened ${fixed} segment file(s).` : "Export: segment files already flat.");
