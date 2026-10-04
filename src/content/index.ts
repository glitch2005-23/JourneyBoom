import path from "node:path";
import { FileSystemContentProvider } from "@/lib/content/filesystem";
import type { ContentProvider } from "./provider";

let provider: ContentProvider | undefined;

/**
 * Single entry point for content. To move to an API or headless CMS, implement
 * ContentProvider (e.g. ApiContentProvider) and return it here — no UI changes needed.
 */
export function getContentProvider(): ContentProvider {
  provider ??= new FileSystemContentProvider({
    contentRoot: path.join(process.cwd(), "content"),
    publicDir: path.join(process.cwd(), "public"),
    strict: process.env.NODE_ENV === "production",
    // Lets a deployment (e.g. GitHub Pages) set the public URL without editing content.
    siteUrlOverride: process.env.SITE_URL || undefined,
  });
  return provider;
}

export type { ContentProvider };
