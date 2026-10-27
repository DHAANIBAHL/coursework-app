import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LayoutGrid } from "lucide-react";

// A single "current section" button that opens a grouped menu of every
// section, instead of a long row of tabs. `sections` are `{ id, label, icon,
// group }`; `active` is the open section's id, or null for the overview.
export default function SectionMenu({ sections, active, onOpen }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = sections.find((s) => s.id === active);
  const Icon = current?.icon ?? LayoutGrid;
  const groups = [...new Set(sections.map((s) => s.group))];

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function choose(id) {
    setOpen(false);
    onOpen(id);
  }

  const item = (on) =>
    `flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
      on
        ? "bg-blue-50 dark:bg-blue-950/50 font-medium text-blue-700 dark:text-blue-300"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Icon className="size-4 text-blue-600 dark:text-blue-400" />
          {current?.label ?? "Overview"}
          <ChevronDown className={`size-4 text-slate-500 dark:text-slate-400 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute left-0 z-30 mt-2 w-72 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-lg sm:w-[30rem]"
          >
            <button type="button" role="menuitem" onClick={() => choose(null)} className={item(!current)}>
              <LayoutGrid className="size-4" /> Overview
              {!current && <Check className="ml-auto size-4" />}
            </button>
            <div className="mt-1 grid gap-x-2 border-t border-slate-100 dark:border-slate-800 pt-1 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g} className="py-1">
                  <p className="px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{g}</p>
                  {sections
                    .filter((s) => s.group === g)
                    .map((s) => (
                      <button key={s.id} type="button" role="menuitem" onClick={() => choose(s.id)} className={item(s.id === active)}>
                        <s.icon className="size-4" /> {s.label}
                        {s.id === active && <Check className="ml-auto size-4" />}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {current && (
        <button
          type="button"
          onClick={() => choose(null)}
          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Back to overview
        </button>
      )}
    </div>
  );
}
