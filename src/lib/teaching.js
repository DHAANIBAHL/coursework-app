import { courses as allCourses, getCourse } from "@/data/courses";

// The courses to show in the Teaching area, with their stats from
// GET /api/teach/overview. Teachers see the courses assigned to them; admins
// can manage any course, so they see every course (with zero stats for
// courses that have no activity yet).
export function teachingCourses(user, overviewCourses = []) {
  const known = overviewCourses.filter((c) => getCourse(c.slug));
  if (user?.role !== "admin") return known;
  const stats = Object.fromEntries(known.map((c) => [c.slug, c]));
  return allCourses.map((c) => stats[c.slug] ?? { slug: c.slug, students: 0, quizAverage: null });
}
