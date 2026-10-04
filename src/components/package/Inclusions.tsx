import { Check } from "lucide-react";

export function Inclusions({ items }: { items: string[] }) {
  return (
    <div className="card h-full p-6 sm:p-7">
      <h3 className="heading-3 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-palm/10 text-palm">
          <Check className="size-5" aria-hidden="true" />
        </span>
        What&rsquo;s included
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink/85">
            <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
