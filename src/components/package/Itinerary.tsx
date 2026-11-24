import { BedDouble, CalendarClock, ChevronDown, Utensils } from "lucide-react";
import type { Destination, ItineraryDay } from "@/types/content";
import { Icon } from "@/components/common/Icon";

interface ItineraryProps {
  days: ItineraryDay[];
  /** Shown instead of the timeline when a package has no day-by-day plan yet. */
  destination: Pick<Destination, "title" | "highlights">;
}

/** Day-by-day timeline of native <details> accordions — accessible and JS-free. */
export function Itinerary({ days, destination }: ItineraryProps) {
  if (!days.length) return <ItineraryComingSoon destination={destination} />;
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

/** No day-by-day plan yet: say so honestly, and give travellers the destination's best experiences. */
function ItineraryComingSoon({ destination }: { destination: ItineraryProps["destination"] }) {
  return (
    <section id="itinerary" className="scroll-mt-36">
      <p className="eyebrow">Day by day</p>
      <h2 className="heading-2 mt-3">Itinerary</h2>
      <div className="mt-8 flex flex-col gap-4 rounded-(--radius-card) border border-dashed border-sky/40 bg-sky/5 p-6 sm:flex-row sm:items-center sm:p-7">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sky/15 text-sky">
          <CalendarClock className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-navy">Detailed itinerary coming soon</p>
          <p className="mt-1 text-[15px] text-ink/75">
            We&rsquo;re finalising the day-by-day plan. Enquire now and our travel expert will share it with you, tailored to your dates.
          </p>
        </div>
      </div>
      {destination.highlights.length > 0 && (
        <div className="mt-10">
          <h3 className="heading-3">Things to do in {destination.title}</h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {destination.highlights.map((h) => (
              <li key={h.title} className="card flex gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange">
                  <Icon name={h.icon} className="size-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-navy">{h.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted">{h.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
