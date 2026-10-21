import { ClipboardCheck, FileText, FlaskConical, ListChecks, Megaphone, PlayCircle, Radio } from "lucide-react";

// Announcement categories, matching announcements.category on the server.
// `tab` is the course section the category belongs to; `items` lists the
// course items an announcement in that category can link to.
export const CATEGORIES = {
  general: { label: "General", icon: Megaphone, tone: "slate" },
  assignment: {
    label: "Assignment",
    icon: ClipboardCheck,
    tone: "blue",
    tab: "assignments",
    items: (d) => d.assignments.map((a) => ({ type: "assignment", id: a.id, title: a.title })),
  },
  quiz: {
    label: "Quiz",
    icon: ListChecks,
    tone: "violet",
    tab: "quizzes",
    items: (d) => d.quizzes.filter((q) => (q.kind ?? "quiz") === "quiz").map((q) => ({ type: "quiz", id: q.id, title: q.title })),
  },
  test: {
    label: "Test",
    icon: FlaskConical,
    tone: "amber",
    tab: "tests",
    items: (d) => d.quizzes.filter((q) => q.kind === "test").map((q) => ({ type: "quiz", id: q.id, title: q.title })),
  },
  live: {
    label: "Live class",
    icon: Radio,
    tone: "red",
    tab: "live",
    items: (d) => d.sessions.map((s) => ({ type: "session", id: s.id, title: s.title })),
  },
  video: {
    label: "Video",
    icon: PlayCircle,
    tone: "green",
    tab: "videos",
    items: (d) => d.materials.filter((m) => m.kind === "video").map((m) => ({ type: "material", id: m.id, title: m.title })),
  },
  material: {
    label: "Learning material",
    icon: FileText,
    tone: "teal",
    tab: "materials",
    items: (d) => d.materials.filter((m) => m.kind !== "video").map((m) => ({ type: "material", id: m.id, title: m.title })),
  },
};

export const categoryOf = (a) => CATEGORIES[a.category] ?? CATEGORIES.general;

// Light and dark colours for each category chip.
export const TONES = {
  slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
  violet: "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300",
  red: "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300",
  green: "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300",
  teal: "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300",
};

// Where a student goes to open an announcement's related item.
export function relatedLinkForStudent(a) {
  if (!a.related) return null;
  if (a.related.type === "quiz") return `/my-learning/quizzes/${a.related.id}`;
  const tab = categoryOf(a).tab ?? { assignment: "assignments", session: "live", material: "materials" }[a.related.type];
  const hash = a.related.type === "assignment" ? `#assignment-${a.related.id}` : "";
  return `/my-learning/courses/${a.courseSlug}?tab=${tab}${hash}`;
}
