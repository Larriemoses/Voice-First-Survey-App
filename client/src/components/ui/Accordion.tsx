import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/helpers";

type AccordionCardProps = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function AccordionCard({
  title,
  meta,
  children,
  defaultOpen = false,
}: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span>
          <span className="block text-base font-medium text-gray-900">{title}</span>
          {meta ? <span className="mt-1 block text-sm text-gray-500">{meta}</span> : null}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-150", open ? "rotate-180" : "")} />
      </button>
      {open ? <div className="border-t border-gray-200 px-5 py-4">{children}</div> : null}
    </section>
  );
}
