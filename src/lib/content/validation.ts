import type { z } from "zod";

export type IssueSeverity = "error" | "warning";

export interface ContentIssue {
  /** Path relative to the project root, e.g. "content/destinations/domestic/goa/destination.json". */
  file: string;
  /** Dotted field path inside the file, e.g. "itinerary[2].title". */
  field?: string;
  message: string;
  severity: IssueSeverity;
}

export class IssueCollector {
  readonly issues: ContentIssue[] = [];

  error(file: string, message: string, field?: string) {
    this.issues.push({ file, field, message, severity: "error" });
  }

  warn(file: string, message: string, field?: string) {
    this.issues.push({ file, field, message, severity: "warning" });
  }

  get errorCount() {
    return this.issues.filter((i) => i.severity === "error").length;
  }
}

export function formatFieldPath(path: readonly PropertyKey[]): string | undefined {
  if (!path.length) return undefined;
  return path.reduce<string>((acc, key) => {
    if (typeof key === "number") return `${acc}[${key}]`;
    return acc ? `${acc}.${String(key)}` : String(key);
  }, "");
}

/** Turns Zod's messages into ones a content author can act on. */
export function describeZodIssue(issue: z.core.$ZodIssue): string {
  if (issue.code === "unrecognized_keys") {
    return `Unknown field${issue.keys.length > 1 ? "s" : ""} ${issue.keys.map((k) => `"${k}"`).join(", ")} — check the spelling`;
  }
  if (issue.code === "invalid_type" && /received undefined/.test(issue.message)) {
    return "Required field is missing";
  }
  if (issue.code === "invalid_value" && "values" in issue) {
    return `Must be one of: ${issue.values.map((v) => JSON.stringify(v)).join(", ")}`;
  }
  return issue.message;
}

export function formatIssues(issues: readonly ContentIssue[]): string {
  const byFile = new Map<string, ContentIssue[]>();
  for (const issue of issues) {
    byFile.set(issue.file, [...(byFile.get(issue.file) ?? []), issue]);
  }
  return [...byFile.entries()]
    .map(([file, list]) =>
      [
        file,
        ...list.map(
          (i) => `  ${i.severity === "error" ? "✖" : "⚠"} ${i.field ? `${i.field}: ` : ""}${i.message}`,
        ),
      ].join("\n"),
    )
    .join("\n\n");
}

export class ContentValidationError extends Error {
  constructor(readonly issues: readonly ContentIssue[]) {
    const errors = issues.filter((i) => i.severity === "error");
    super(
      `Content validation failed with ${errors.length} error(s). Run "npm run validate-content" for details.\n\n${formatIssues(errors)}`,
    );
    this.name = "ContentValidationError";
  }
}
