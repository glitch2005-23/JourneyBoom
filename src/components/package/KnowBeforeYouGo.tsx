import { Info } from "lucide-react";

export function KnowBeforeYouGo({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="know-title" className="rounded-(--radius-card) border border-sky/20 bg-sky/5 p-6 sm:p-8">
      <h2 id="know-title" className="flex items-center gap-3 font-display text-xl font-bold text-navy">
        <Info className="size-5 text-sky" aria-hidden="true" />
        Know before you go
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink/80">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
