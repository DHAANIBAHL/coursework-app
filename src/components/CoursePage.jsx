import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import { ErrorNote, Loading } from "@/components/panel/Panel";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useApi } from "@/lib/api";
import { nextLessonIndex, useEnrollment } from "@/lib/learning";

export default function CoursePage() {
  // Reads ":slug" from the URL, e.g. /course/web-design -> "web-design"
  const { slug } = useParams();
  // The course, its modules and lessons, and its quizzes (GET /api/courses/:id).
  const { data, error, reload } = useApi(`/courses/${encodeURIComponent(slug)}`);
  // useApi keeps the last result while a new one loads; ignore another course's.
  const course = data?.course?.slug === slug ? data.course : null;
  const { hash } = useLocation();
  const enrollment = useEnrollment(slug);

  // A link like /course/web-design#lesson-5 (e.g. from search) opens that
  // lesson and scrolls to it, once the lessons and the join/progress panel
  // above them have loaded (so the panel doesn't push the lesson down after).
  const ready = Boolean(course) && !enrollment.loading;
  useEffect(() => {
    const lesson = hash && ready ? document.getElementById(hash.slice(1)) : null;
    if (lesson?.tagName === "DETAILS") {
      lesson.open = true;
      lesson.scrollIntoView({ block: "start" });
    }
  }, [hash, ready]);

  if (error?.code === "COURSE_NOT_FOUND") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Course not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            There's no course at this address. Check the link or pick one from the catalog.
          </p>
          <Link to="/courses" className={`${buttonVariants()} mt-6`}>
            Back to courses
          </Link>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-12">{error ? <ErrorNote error={error} onRetry={reload} /> : <Loading />}</main>
      </div>
    );
  }

  const { category, title, description, lessonCount, modules, quizzes } = course;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="page-enter mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          All courses
        </Link>

        <div className="mt-10">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {category}
          </Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{description}</p>

        <EnrollPanel slug={slug} lessonCount={lessonCount} enrollment={enrollment} />

        <h2 className="mt-12 text-xl font-semibold text-slate-900 dark:text-slate-100">Lessons</h2>

        {lessonCount === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-6 text-slate-500 dark:text-slate-400">
            Lessons for this course are still being written.
          </p>
        ) : (
          modules.map((module) => (
            <section key={module.id} className="mt-8">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                <span className="text-slate-500 dark:text-slate-400">Module {module.position}:</span> {module.title}
              </h3>
              {module.summary && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{module.summary}</p>}
              <div className="mt-3 space-y-3">
                {module.lessons.map((lesson) => (
                  <Lesson key={lesson.id} lesson={lesson} enrollment={enrollment} />
                ))}
              </div>
            </section>
          ))
        )}

        {quizzes.length > 0 && (
          <div className="mt-12 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Check what you learned</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}, one for each section of the course.
            </p>
            <div className="mt-4 space-y-3">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Quiz {index + 1}</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{quiz.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {quiz.description} {quiz.questionCount} questions.
                    </p>
                  </div>
                  <Link to={`/course/${slug}/quiz/${quiz.slug}`} className={buttonVariants()}>
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

// One lesson. `position` counts across the whole course, so lesson numbers,
// #lesson-<n> links and saved progress (by 0-based index) don't depend on modules.
function Lesson({ lesson, enrollment }) {
  const index = lesson.position - 1;
  return (
    <details
      id={`lesson-${lesson.position}`}
      className="group scroll-mt-24 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors hover:border-slate-300 dark:hover:border-slate-700 open:border-slate-300 dark:open:border-slate-700 open:shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-4 font-medium text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60 [&::-webkit-details-marker]:hidden">
        <span className="text-sm text-blue-600 dark:text-blue-400">Lesson {lesson.position}</span>
        <span className="flex-1">{lesson.title}</span>
        {enrollment.completed.has(index) && (
          <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" aria-label="Completed" />
        )}
        <ChevronDown className="size-4 text-slate-400 dark:text-slate-500 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-200 dark:border-slate-800 px-4 pb-4 pt-3">
        {lesson.videoUrl && (
          // preload="metadata" loads only the length and first frame until Play is pressed.
          // Always a 16:9 frame; videos of other shapes fit inside with black bars.
          <video
            src={lesson.videoUrl}
            controls
            preload="metadata"
            className="mb-4 aspect-video w-full rounded-md bg-black object-contain"
          >
            Your browser can't play this video.
          </video>
        )}
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">{lesson.body}</p>
        {lesson.code && (
          <pre className="mt-4 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <code>{lesson.code}</code>
          </pre>
        )}
        {lesson.afterText && (
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">{lesson.afterText}</p>
        )}
        {enrollment.enrolled && (
          <LessonDoneButton
            done={enrollment.completed.has(index)}
            onChange={(done) => enrollment.setLessonDone(index, done)}
          />
        )}
      </div>
    </details>
  );
}

// Join the course, or (once joined) see progress and jump to the next lesson.
function EnrollPanel({ slug, lessonCount, enrollment }) {
  const { enrolled, completed, teachers, loading, busy, error, join } = enrollment;
  if (loading) return null;

  if (!enrolled) {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
        <GraduationCap className="size-8 shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900 dark:text-slate-100">Join this course</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your progress, save quiz scores, and get class material, assignments, and live classes
            {teachers.length > 0 && ` from ${teachers.join(", ")}`}.
          </p>
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </div>
        <Button onClick={join} disabled={busy}>
          {busy ? "Joining…" : "Join course"}
        </Button>
      </div>
    );
  }

  const done = completed.size;
  const total = lessonCount;
  const next = nextLessonIndex(total, completed);
  return (
    <div className="mt-8 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {done === total && total > 0 ? "Course complete. Nice work!" : `${done} of ${total} lessons complete`}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {done < total && (
            <a href={`#lesson-${next + 1}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Next: lesson {next + 1}
            </a>
          )}
          <Link to={`/my-learning/courses/${slug}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Open classroom
          </Link>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-green-600 dark:bg-green-400 transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
  );
}

function LessonDoneButton({ done, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!done)}
      className={`mt-5 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        done
          ? "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
          : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
      {done ? "Completed" : "Mark as complete"}
    </button>
  );
}
