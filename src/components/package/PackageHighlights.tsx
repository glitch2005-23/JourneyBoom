import { Sparkles } from "lucide-react";

export function PackageHighlights({ highlights }: { highlights: string[] }) {
  return (
    <section aria-labelledby="highlights-title" className="rounded-(--radius-card) bg-navy p-6 text-white sm:p-8">
      <h2 id="highlights-title" className="font-display text-xl font-bold text-white">
        Trip highlights
      </h2>
      <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {highlights.map((h) => (
          <li key={h} className="flex gap-3 text-[15px] leading-snug text-white/90">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
    </section>
  );
}
