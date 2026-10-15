import { BookOpen, LayoutDashboard } from "lucide-react";
import { PanelLayout } from "@/components/panel/Panel";
import { useAuth } from "@/context/AuthContext";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";
import { teachingCourses } from "@/lib/teaching";

// The /teach area: a dashboard plus one sidebar entry per course the teacher
// teaches (every course, for admins).
export default function TeachLayout() {
  const { user } = useAuth();
  const overview = useApi("/teach/overview");
  const courses = teachingCourses(user, overview.data?.courses);

  const items = [
    { to: "/teach", label: "Dashboard", icon: LayoutDashboard, end: true },
    ...courses.map((c) => ({
      to: `/teach/courses/${c.slug}`,
      label: getCourse(c.slug).title,
      icon: BookOpen,
    })),
  ];

  return <PanelLayout title={user?.role === "admin" ? "Teaching (all courses)" : "Teaching"} items={items} />;
}
