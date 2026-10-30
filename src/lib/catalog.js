import { useCallback, useEffect, useMemo, useState } from "react";
import { api, useApi } from "@/lib/api";

// Shared readers for the course catalog, which the server serves from the
// catalog database (GET /api/courses and GET /api/courses/:id).

// The course list is fetched once and shared by every component that asks for
// it while the site is open (a layout and its page both need it). A failed
// request is forgotten, so reload() tries again.
let listRequest = null;
function fetchCourses() {
  listRequest ??= api("/courses")
    .then((data) => data.courses)
    .catch((err) => {
      listRequest = null;
      throw err;
    });
  return listRequest;
}

// { courses, courseBySlug, loading, error, reload }. Each course is an entry
// from GET /api/courses (title, category, imageUrl, color, lessonCount, …);
// courseBySlug(slug) returns one, or undefined.
export function useCatalog() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ attempt: -1, courses: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchCourses().then(
      (courses) => !cancelled && setResult({ attempt, courses, error: null }),
      (error) => !cancelled && setResult({ attempt, courses: null, error })
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const bySlug = useMemo(() => new Map((result.courses ?? []).map((c) => [c.slug, c])), [result.courses]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const loading = result.attempt !== attempt;
  return {
    courses: result.courses ?? [],
    courseBySlug: (slug) => bySlug.get(slug),
    loading,
    error: loading ? null : result.error,
    reload,
  };
}

// One course with its modules, plus `lessons` (every lesson in order, across
// modules; `position` is 1-based) and `quizzes` (catalog quizzes: `slug`,
// `title`, `description`, `questionCount`). { course, error, loading, reload };
// an unknown course gives an error with code COURSE_NOT_FOUND.
export function useCourse(slug) {
  const { data, error, loading, reload } = useApi(`/courses/${encodeURIComponent(slug)}`);
  const course = useMemo(() => {
    const c = data?.course;
    // useApi keeps the last result while a new one loads; ignore another course's.
    if (!c || c.slug !== slug) return null;
    return { ...c, lessons: c.modules.flatMap((m) => m.lessons) };
  }, [data, slug]);
  return { course, error: course ? null : error, loading: !course && (loading || !error), reload };
}
