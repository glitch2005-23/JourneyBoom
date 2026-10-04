/**
 * npm run brand
 *
 * One-off: turns the supplied logo artwork (assets/brand/logo-source.png, white background)
 * into web-ready transparent PNGs and favicons. Outputs are committed, so this only needs
 * re-running if the source artwork changes (adjust the crop boxes below if its layout does).
 */
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const SOURCE = path.join(root, "assets/brand/logo-source.png");
const OUT = path.join(root, "public/images/brand");

// Regions of the 1254×1254 source artwork.
const EMBLEM = { left: 225, top: 127, width: 820, height: 785 };
const WORDMARK = { left: 35, top: 926, width: 1170, height: 136 };
const LOCKUP = { left: 30, top: 125, width: 1195, height: 995 };

/** GIMP-style "colour to alpha" against white: identical on white, clean on any other background. */
async function knockOutWhite(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    let alpha = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (alpha < 0.05) alpha = 0; // JPEG noise near white
    if (alpha === 0) {
      data[i + 3] = 0;
      continue;
    }
    const unblend = (c: number) => Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - alpha)) / alpha)));
    data[i] = unblend(r);
    data[i + 1] = unblend(g);
    data[i + 2] = unblend(b);
    data[i + 3] = Math.round(alpha * 255);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function main() {
  const transparent = await knockOutWhite(SOURCE);
  const crop = (box: typeof EMBLEM) => sharp(transparent).extract(box).png().toBuffer();

  const [emblem, wordmark, lockup] = await Promise.all([crop(EMBLEM), crop(WORDMARK), crop(LOCKUP)]);

  // Full stacked lockup (footer, about page).
  await sharp(lockup).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo.png"));
  // Emblem alone.
  await sharp(emblem).resize({ height: 512 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-mark.png"));

  // Horizontal lockup for the header: emblem + wordmark, vertically centred.
  const MARK_H = 240;
  const WORD_H = 96;
  const GAP = 28;
  const markBuf = await sharp(emblem).resize({ height: MARK_H }).toBuffer();
  const wordBuf = await sharp(wordmark).resize({ height: WORD_H }).toBuffer();
  const markMeta = await sharp(markBuf).metadata();
  const wordMeta = await sharp(wordBuf).metadata();
  const width = markMeta.width! + GAP + wordMeta.width!;
  await sharp({ create: { width, height: MARK_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: markBuf, left: 0, top: 0 },
      { input: wordBuf, left: markMeta.width! + GAP, top: Math.round((MARK_H - WORD_H) / 2) + 6 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "logo-horizontal.png"));

  // Favicons (App Router picks these up automatically).
  const square = (size: number, whiteBackground: boolean) => {
    const inner = Math.round(size * 0.86);
    const pad = Math.round((size - inner) / 2);
    const clear = { r: 0, g: 0, b: 0, alpha: 0 };
    const image = sharp(emblem)
      .resize({ width: inner, height: inner, fit: "contain", background: clear })
      .extend({ top: pad, left: pad, bottom: size - inner - pad, right: size - inner - pad, background: clear });
    return (whiteBackground ? image.flatten({ background: "#ffffff" }) : image).png();
  };
  await square(512, false).toFile(path.join(root, "src/app/icon.png"));
  await square(180, true).toFile(path.join(root, "src/app/apple-icon.png"));

  // Neutral fallback shown in place of missing images: sand background with a faded emblem.
  const faded = await sharp(emblem)
    .resize({ height: 260 })
    .composite([{ input: Buffer.from([255, 255, 255, 46]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp({ create: { width: 1600, height: 1000, channels: 3, background: "#f1ece3" } })
    .composite([{ input: faded, gravity: "center" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(root, "public/images/fallback.jpg"));

  console.log(`Brand assets written (header lockup ${width}×${MARK_H}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
