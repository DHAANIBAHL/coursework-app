import { BookOpen, LayoutDashboard } from "lucide-react";
import { PanelLayout } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";

// The /teach area: a dashboard plus one sidebar entry per course the teacher teaches.
export default function TeachLayout() {
  const overview = useApi("/teach/overview");
  const courses = overview.data?.courses ?? [];

  const items = [
    { to: "/teach", label: "Dashboard", icon: LayoutDashboard, end: true },
    ...courses.map((c) => ({
      to: `/teach/courses/${c.slug}`,
      label: getCourse(c.slug)?.title ?? c.slug,
      icon: BookOpen,
    })),
  ];

  return <PanelLayout title="Teaching" items={items} />;
}
