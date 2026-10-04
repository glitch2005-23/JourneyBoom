import type { Destination } from "@/types/content";
import { Icon } from "@/components/common/Icon";
import { Reveal } from "@/components/common/Reveal";

export function DestinationHighlights({ highlights }: { highlights: Destination["highlights"] }) {
  if (!highlights.length) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((h, i) => (
        <Reveal as="li" key={h.title} delay={(i % 4) * 80} className="card p-6">
          <span className="grid size-12 place-items-center rounded-xl bg-orange/10 text-orange">
            <Icon name={h.icon} className="size-6" />
          </span>
          <h3 className="heading-3 mt-5">{h.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{h.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
