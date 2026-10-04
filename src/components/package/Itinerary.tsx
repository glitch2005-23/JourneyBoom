import { BedDouble, ChevronDown, Utensils } from "lucide-react";
import type { ItineraryDay } from "@/types/content";

/** Day-by-day timeline of native <details> accordions — accessible and JS-free. */
export function Itinerary({ days }: { days: ItineraryDay[] }) {
  return (
    <section id="itinerary" className="scroll-mt-36">
      <p className="eyebrow">Day by day</p>
      <h2 className="heading-2 mt-3">Itinerary</h2>
      <ol className="relative mt-8 space-y-4 before:absolute before:top-6 before:bottom-6 before:left-[1.4rem] before:w-px before:bg-sky/30">
        {days.map((day) => (
          <li key={day.day} className="relative pl-14">
            <span
              className="absolute top-3 left-0 grid size-11 place-items-center rounded-full border-4 border-sand bg-sky font-display text-sm font-bold text-white"
              aria-hidden="true"
            >
              {String(day.day).padStart(2, "0")}
            </span>
            <details className="group card overflow-hidden" open={day.day === 1}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <span>
                  <span className="block text-xs font-semibold tracking-wider text-orange uppercase">Day {day.day}</span>
                  <span className="mt-0.5 block font-display font-semibold text-navy sm:text-lg">{day.title}</span>
                </span>
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="border-t border-line px-5 pt-4 pb-5 sm:px-6">
                <p className="leading-relaxed text-ink/80">{day.description}</p>
                {(day.meals.length > 0 || day.overnight) && (
                  <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
                    {day.meals.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-ink/80">
                        <Utensils className="size-3.5 text-orange" aria-hidden="true" />
                        {day.meals.join(" · ")}
                      </span>
                    )}
                    {day.overnight && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-ink/80">
                        <BedDouble className="size-3.5 text-orange" aria-hidden="true" />
                        Overnight: {day.overnight}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
