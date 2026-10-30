import { BookOpen, LayoutDashboard } from "lucide-react";
import { PanelLayout } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";
import { useCatalog } from "@/lib/catalog";
import { teachingCourses } from "@/lib/teaching";

// The /teach area: a dashboard plus one sidebar entry per course with a
// teacher assigned (see teachingCourses).
export default function TeachLayout() {
  const overview = useApi("/teach/overview");
  const catalog = useCatalog();
  const courses = teachingCourses(overview.data?.courses, catalog) ?? [];

  const items = [
    { to: "/teach", label: "Dashboard", icon: LayoutDashboard, end: true },
    ...courses.map((c) => ({
      to: `/teach/courses/${c.slug}`,
      label: c.title,
      icon: BookOpen,
    })),
  ];

  return <PanelLayout title="Teaching" items={items} />;
}
