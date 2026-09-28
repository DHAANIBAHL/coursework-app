import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCourse } from "@/data/courses";

export default function CoursePage() {
  // Reads ":slug" from the URL, e.g. /course/web-design -> "web-design"
  const { slug } = useParams();
  const course = getCourse(slug);
  const { hash } = useLocation();

  // A link like /course/web-design#lesson-5 (e.g. from search) opens that
  // lesson and scrolls to it.
  useEffect(() => {
    const lesson = hash ? document.getElementById(hash.slice(1)) : null;
    if (lesson?.tagName === "DETAILS") {
      lesson.open = true;
      lesson.scrollIntoView({ block: "start" });
    }
  }, [hash, slug]);

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold text-slate-900">Course not found</h1>
          <p className="mt-2 text-slate-600">
            There's no course at this address. Check the link or pick one from the catalog.
          </p>
          <Link to="/" className={`${buttonVariants()} mt-6`}>
            Back to courses
          </Link>
        </main>
      </div>
    );
  }

  const { tag, title, description, lessons, quizzes } = course;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          All courses
        </Link>

        <div className="mt-10">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {tag}
          </Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-3 text-lg text-slate-600">{description}</p>

        <h2 className="mt-12 text-xl font-semibold text-slate-900">Lessons</h2>

        {lessons.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
            Lessons for this course are still being written.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {lessons.map((lesson, index) => (
              <details
                key={lesson.title}
                id={`lesson-${index + 1}`}
                className="group scroll-mt-24 rounded-lg border border-slate-200 open:border-slate-300 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span className="text-sm text-blue-600">Lesson {index + 1}</span>
                  <span className="flex-1">{lesson.title}</span>
                  <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>

                <div className="border-t border-slate-200 px-4 pb-4 pt-3">
                  <p className="leading-relaxed text-slate-700">{lesson.body}</p>
                  {lesson.code && (
                    <pre className="mt-4 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
                      <code>{lesson.code}</code>
                    </pre>
                  )}
                  {lesson.after && (
                    <p className="mt-4 leading-relaxed text-slate-700">{lesson.after}</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}

        {quizzes.length > 0 && (
          <div className="mt-12 rounded-lg bg-blue-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Check what you learned</h2>
            <p className="mt-1 text-slate-600">
              {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}, one for each section of the course.
            </p>
            <div className="mt-4 space-y-3">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-blue-600">Quiz {index + 1}</p>
                    <p className="font-medium text-slate-900">{quiz.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {quiz.description} {quiz.questions.length} questions.
                    </p>
                  </div>
                  <Link to={`/course/${slug}/quiz/${quiz.id}`} className={buttonVariants()}>
                    Take quiz
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}