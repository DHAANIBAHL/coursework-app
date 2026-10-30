import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, Plus } from "lucide-react";
import { PanelLayout } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";
import { useCatalog } from "@/lib/catalog";

// The /my-learning area: the student dashboard plus one sidebar entry per
// course they've joined.
export default function LearnLayout() {
  const { data } = useApi("/learn/enrollments");
  const catalog = useCatalog();
  // Courses fill in once the catalog has loaded; if it can't, they're listed by slug.
  const enrollments = catalog.loading ? [] : (data?.enrollments ?? []).filter((e) => catalog.error || catalog.courseBySlug(e.slug));

  const items = [
    { to: "/my-learning", label: "Dashboard", icon: LayoutDashboard, end: true },
    ...enrollments.map((e) => ({
      to: `/my-learning/courses/${e.slug}`,
      label: catalog.courseBySlug(e.slug)?.title ?? e.slug,
      icon: BookOpen,
    })),
  ];

  return (
    <PanelLayout
      title="My learning"
      items={items}
      footer={
        <Link
          to="/courses"
          className="mt-2 hidden items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 md:flex"
        >
          <Plus className="size-4" /> Join another course
        </Link>
      }
    />
  );
}
