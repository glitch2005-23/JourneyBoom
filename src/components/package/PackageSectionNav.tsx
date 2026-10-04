/** Sticky in-page navigation for the long package page (plain anchors — no JS needed). */
export function PackageSectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur-md lg:top-[4.25rem]">
      <ul className="container-site flex gap-1 overflow-x-auto">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              className="relative block px-3 py-4 font-display text-sm font-semibold text-ink/70 transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-orange after:transition-transform hover:text-navy hover:after:scale-x-100 sm:px-4"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
