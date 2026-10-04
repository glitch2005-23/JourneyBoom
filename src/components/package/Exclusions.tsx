import { X } from "lucide-react";

export function Exclusions({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="card h-full p-6 sm:p-7">
      <h3 className="heading-3 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-red-50 text-red-500">
          <X className="size-5" aria-hidden="true" />
        </span>
        Not included
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink/75">
            <X className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
