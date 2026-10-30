// The courses to show in the Teaching area: those with a teacher assigned
// (the teacher's own courses; for admins, every course that has a teacher),
// with their stats from GET /api/teach/overview, each given its catalog
// `title`. Admins choose which courses appear by assigning teachers under
// Admin → Content. `catalog` is useCatalog(); returns null until it loads.
// If the catalog can't load, courses still show, titled by their slug.
export function teachingCourses(overviewCourses = [], catalog) {
  if (catalog.loading) return null;
  return overviewCourses
    .filter((c) => catalog.error || catalog.courseBySlug(c.slug))
    .map((c) => ({ ...c, title: catalog.courseBySlug(c.slug)?.title ?? c.slug }));
}
