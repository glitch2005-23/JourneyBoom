/**
 * npm run images  (runs automatically before `dev` and `build`)
 *
 * Pre-renders every raster image under public/images into responsive WebP variants
 * (public/_img/...-<width>.webp) for the custom next/image loader — giving optimised,
 * responsive images on a fully static host. Incremental: unchanged images are skipped.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ALL_IMAGE_WIDTHS, OPTIMIZED_DIR, optimizedPath } from "../src/lib/images/widths";

const publicDir = path.join(process.cwd(), "public");
const sourceDir = path.join(publicDir, "images");
const RASTER = /\.(jpe?g|png|webp|avif)$/i;

function listImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) return listImages(abs);
    return RASTER.test(entry.name) ? [abs] : [];
  });
}

async function main() {
  const sources = listImages(sourceDir);
  const expected = new Set<string>();
  let generated = 0;

  for (const abs of sources) {
    const src = `/${path.relative(publicDir, abs).split(path.sep).join("/")}`;
    const sourceTime = fs.statSync(abs).mtimeMs;
    const outputs = ALL_IMAGE_WIDTHS.map((w) => ({ w, file: path.join(publicDir, optimizedPath(src, w)) }));
    outputs.forEach((o) => expected.add(o.file));

    const stale = outputs.filter((o) => !fs.existsSync(o.file) || fs.statSync(o.file).mtimeMs < sourceTime);
    if (!stale.length) continue;

    fs.mkdirSync(path.dirname(stale[0]!.file), { recursive: true });
    await Promise.all(
      stale.map(({ w, file }) =>
        sharp(abs)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: w <= 480 ? 72 : 76, effort: 4 })
          .toFile(file),
      ),
    );
    generated += stale.length;
  }

  // Remove variants whose source image was deleted or renamed.
  let removed = 0;
  for (const file of listImages(path.join(publicDir, OPTIMIZED_DIR))) {
    if (!expected.has(file)) {
      fs.rmSync(file);
      removed++;
    }
  }

  console.log(
    `Images: ${sources.length} source(s), ${generated} variant(s) generated` + (removed ? `, ${removed} stale removed` : "") + ".",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
