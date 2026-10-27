import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, Plus } from "lucide-react";
import { PanelLayout } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";

// The /my-learning area: the student dashboard plus one sidebar entry per
// course they've joined.
export default function LearnLayout() {
  const { data } = useApi("/learn/enrollments");
  const enrollments = (data?.enrollments ?? []).filter((e) => getCourse(e.slug));

  const items = [
    { to: "/my-learning", label: "Dashboard", icon: LayoutDashboard, end: true },
    ...enrollments.map((e) => ({
      to: `/my-learning/courses/${e.slug}`,
      label: getCourse(e.slug).title,
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
