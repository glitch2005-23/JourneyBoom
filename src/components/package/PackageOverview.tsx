import type { TravelPackage } from "@/types/content";

export function PackageOverview({ pkg }: { pkg: TravelPackage }) {
  return (
    <section id="overview" className="scroll-mt-36">
      <p className="eyebrow">Overview</p>
      <h2 className="heading-2 mt-3">About this journey</h2>
      <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/80">
        {pkg.description.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
    </section>
  );
}
