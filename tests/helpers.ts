import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach } from "vitest";
import { loadContent } from "@/lib/content/load";

export const ROOT = path.resolve(__dirname, "..");
export const PUBLIC_DIR = path.join(ROOT, "public");
const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

/** Copies the real content/ into a temp project so a test can break it safely. */
export function tempContent(): { contentRoot: string; file: (rel: string) => string } {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "jb-content-"));
  temps.push(project);
  const contentRoot = path.join(project, "content");
  fs.cpSync(path.join(ROOT, "content"), contentRoot, { recursive: true });
  return { contentRoot, file: (rel) => path.join(contentRoot, rel) };
}

export function readJson<T = Record<string, unknown>>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/** Applies a mutation to a JSON file in place. */
export function editJson(file: string, edit: (data: Record<string, unknown>) => void) {
  const data = readJson(file);
  edit(data);
  writeJson(file, data);
}

export function load(contentRoot: string) {
  return loadContent({ contentRoot, publicDir: PUBLIC_DIR });
}

export function errorsOf(result: ReturnType<typeof load>) {
  return result.issues.filter((i) => i.severity === "error");
}

export const PKG = "destinations/domestic/srinagar/packages/kashmir-delight.json";
export const DEST = "destinations/domestic/srinagar/destination.json";
