import { Pin } from "lucide-react";
import { TONES, categoryOf } from "@/lib/announcements";

// The small coloured label on an announcement ("Test", "Live class", …).
export function CategoryChip({ announcement }) {
  const c = categoryOf(announcement);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TONES[c.tone]}`}>
      <c.icon className="size-3" /> {c.label}
    </span>
  );
}

export function PinnedChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
      <Pin className="size-3" /> Pinned
    </span>
  );
}
