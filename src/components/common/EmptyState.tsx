import type { ReactNode } from "react";
import { Compass } from "lucide-react";

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-orange/10 text-orange">
        <Compass className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="heading-3">{title}</h3>
      <p className="mt-2 max-w-md text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
