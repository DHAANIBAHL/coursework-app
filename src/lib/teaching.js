import { getCourse } from "@/data/courses";

// The courses to show in the Teaching area: those with a teacher assigned
// (the teacher's own courses; for admins, every course that has a teacher),
// with their stats from GET /api/teach/overview. Admins choose which courses
// appear by assigning teachers under Admin → Content.
export function teachingCourses(overviewCourses = []) {
  return overviewCourses.filter((c) => getCourse(c.slug));
}
