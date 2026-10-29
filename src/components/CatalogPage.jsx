import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { ErrorNote, Loading } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";

export default function CatalogPage() {
  // The catalog comes from the server (GET /api/courses), with lesson and
  // quiz counts worked out by the database.
  const { data, error, loading, reload } = useApi("/courses");
  const courses = data?.courses ?? [];
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);
  const totalQuizzes = courses.reduce((sum, c) => sum + c.quizCount, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <section className="page-enter max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold max-w-xl mb-4">
          {data ? `${courses.length} courses. ${totalLessons} lessons. ${totalQuizzes} quizzes.` : "Courses"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl">
          Short, practical courses on building for the web - work through the
          lessons in order, then check what stuck with a quiz after each section.
        </p>
      </section>

      <section className="page-enter max-w-6xl mx-auto px-6 pb-20 [animation-delay:80ms]">
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorNote error={error} onRetry={reload} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
