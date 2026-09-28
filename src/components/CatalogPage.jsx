import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

export default function CatalogPage() {
  // Counts real lessons and quizzes from the course data, so this grows as you add content.
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalQuizzes = courses.reduce((sum, c) => sum + c.quizzes.length, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold max-w-xl mb-4">
          {courses.length} courses. {totalLessons} lessons. {totalQuizzes} quizzes.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl">
          Short, practical courses on building for the web - work through the
          lessons in order, then check what stuck with a quiz after each section.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </section>
    </div>
  );
}
