import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  Code2,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Presentation,
  Search,
  UserPlus,
} from "lucide-react";
import Header from "@/components/Header";
import { buttonVariants } from "@/components/ui/button";
import { courses } from "@/data/courses";

// Public homepage for visitors who aren't logged in. Every number and course
// shown here comes from the course data, so it stays accurate as content grows.
const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
const totalQuizzes = courses.reduce((sum, c) => sum + c.quizzes.length, 0);
const topics = [...new Set(courses.map((c) => c.tag))];

const features = [
  {
    icon: BookOpen,
    title: "Short, focused lessons",
    text: "Each lesson explains one idea in plain language, shows a working example, and ends with a takeaway you can use right away.",
  },
  {
    icon: Code2,
    title: "Real code in every lesson",
    text: "Examples you can copy and run, from HTML and CSS to React, Python, SQL, and deploying to the cloud.",
  },
  {
    icon: ListChecks,
    title: "A quiz for every section",
    text: "Check what stuck after each part of a course. Every answer comes with an explanation, and you can retake as often as you like.",
  },
  {
    icon: PlayCircle,
    title: "Video lessons",
    text: "Watch a lesson explained, then read it through at your own pace.",
  },
  {
    icon: Presentation,
    title: "Live classes with teachers",
    text: "Join scheduled live sessions, ask questions, and learn alongside other students.",
  },
  {
    icon: CalendarClock,
    title: "Assignments and deadlines",
    text: "See what's due, submit your work, and get feedback, all from your own dashboard.",
  },
];

const steps = [
  { title: "Create a free account", text: "Sign up with your name and email. It takes under a minute." },
  { title: "Pick a course", text: `Choose from ${courses.length} courses across ${topics.length} topics, and start wherever you like.` },
  { title: "Learn and check yourself", text: "Work through the lessons in order, then take the quiz at the end of each section." },
];

const faqs = [
  { q: "Is it really free?", a: "Yes. Every course, lesson, and quiz is free with an account." },
  { q: "Do I need experience?", a: "No. Courses start from the basics. If you're new, begin with Introduction to Web Design." },
  { q: "Do I need to install anything?", a: "No. Everything runs in your browser. Some courses suggest tools if you want to try the code yourself." },
];

const sectionTitle = "text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100";
const sectionLead = "mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400";

export default function LandingPage() {
  const heroCourses = courses.filter((c) => c.image).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              <GraduationCap className="size-4" />
              Free courses for builders
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
              Learn to build for the web, one short lesson at a time.
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
              Practical courses on web design, JavaScript, React, Python, databases, and the cloud.
              Read, watch, practise with real code, and check what stuck with a quiz after every section.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className={buttonVariants({ size: "lg", className: "group h-11 px-5 text-base" })}>
                Start learning free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#courses" className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-5 text-base" })}>
                Browse courses
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 pt-6">
              {[
                [courses.length, "courses"],
                [totalLessons, "lessons"],
                [totalQuizzes, "quizzes"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* A stack of real course cards as the hero picture */}
          <div className="relative hidden h-96 md:block page-enter" aria-hidden="true">
            {heroCourses.map((course, index) => (
              <div
                key={course.slug}
                className="absolute w-72 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition duration-300 ease-out hover:z-10 hover:-translate-y-3 hover:shadow-2xl motion-reduce:transition-none"
                style={{ top: `${index * 3.5}rem`, left: `${index * 4.5}rem`, rotate: `${(index - 1) * 4}deg` }}
              >
                <img src={course.image} alt="" className="h-32 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{course.tag}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{course.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {course.lessons.length} lessons · {course.quizzes.length} quizzes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Topics strip */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            {topics.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={sectionTitle}>Everything you need to actually learn it</h2>
          <p className={sectionLead}>
            Not just videos to sit through. Each course mixes reading, examples, video, and practice.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="lift group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 hover:border-blue-200 dark:hover:border-blue-900">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Course catalogue */}
        <section id="courses" className="scroll-mt-20 bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className={sectionTitle}>{courses.length} courses, all free</h2>
            <p className={sectionLead}>
              Pick one to start. Create an account and you'll go straight to the course.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  to="/signup"
                  state={{ from: `/course/${course.slug}` }}
                  className="lift group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <div className="h-40 overflow-hidden">
                    {course.image ? (
                      <img src={course.image} alt="" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none" />
                    ) : (
                      <div className={`flex h-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none ${course.color}`}>
                        <span className="text-2xl font-semibold text-white">{course.tag}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{course.tag}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{course.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{course.description}</p>
                    <p className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>
                        {course.lessons.length} lessons · {course.quizzes.length} quizzes
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                        Start
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={sectionTitle}>How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="lift group rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-sm font-semibold text-white dark:text-slate-900 transition-colors group-hover:bg-blue-600 dark:group-hover:bg-blue-500 dark:group-hover:text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* For teachers */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid items-center gap-8 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">For teachers</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Teach your class in one place
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Faculty get their own panel to share material, upload videos, create quizzes, set
                assignments with deadlines, run live sessions, and follow how their students are doing.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {[
                [ClipboardCheck, "Create quizzes and assignments, and grade submissions"],
                [PlayCircle, "Upload teaching material and lesson videos"],
                [Presentation, "Schedule and run live classes"],
                [Search, "See progress and results across your students"],
              ].map(([Icon, text]) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className={`${sectionTitle} text-center`}>Questions</h2>
            <dl className="mt-10 space-y-6">
              {faqs.map((item) => (
                <div key={item.q}>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">{item.q}</dt>
                  <dd className="mt-1 text-slate-600 dark:text-slate-400">{item.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
              More answers on the{" "}
              <Link to="/help" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Help page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Final call to action */}
        <section className="bg-slate-900 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-white">Ready to start?</h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Create a free account and open your first lesson in under a minute.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 font-medium text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg motion-reduce:hover:translate-y-0"
            >
              <UserPlus className="size-4" />
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Coursework</span> · Free courses for
            builders. © {new Date().getFullYear()}
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#courses" className="transition-colors hover:text-slate-900 dark:hover:text-white">Courses</a>
            <Link to="/help" className="transition-colors hover:text-slate-900 dark:hover:text-white">Help</Link>
            <Link to="/contact" className="transition-colors hover:text-slate-900 dark:hover:text-white">Contact us</Link>
            <Link to="/login" className="transition-colors hover:text-slate-900 dark:hover:text-white">Log in</Link>
            <Link to="/signup" className="transition-colors hover:text-slate-900 dark:hover:text-white">Sign up</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
