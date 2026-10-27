import { useEffect } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle, Download, ExternalLink, FileText, Link2, Megaphone, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, ErrorNote, Loading, PageHeading, Section } from "@/components/panel/Panel";
import DeadlineStatus from "@/components/learn/DeadlineStatus";
import SubmitAssignment from "@/components/learn/SubmitAssignment";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";
import { fileSize, formatDate, percent, plural, relativeTime } from "@/lib/format";
import { useNow } from "@/lib/useNow";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "live", label: "Live class" },
  { id: "announcements", label: "Announcements" },
  { id: "quizzes", label: "Quizzes" },
  { id: "tests", label: "Tests" },
  { id: "assignments", label: "Assignments" },
  { id: "videos", label: "Videos" },
  { id: "materials", label: "Learning materials" },
];

// One course from the student's side: progress plus everything the teacher shares.
export default function LearnCourse() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const course = getCourse(slug);
  const { data, error, loading, reload } = useApi(`/learn/courses/${slug}`);
  const active = tabs.find((t) => t.id === params.get("tab"))?.id ?? "overview";
  const now = useNow();

  if (!course) return <ErrorNote error={new Error("There's no course at this address.")} />;
  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  if (!data.enrolled) {
    return (
      <>
        <PageHeading title={course.title} />
        <Section>
          <EmptyState>
            You haven't joined this course.{" "}
            <Link to={`/course/${slug}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Open the course page to join
            </Link>
            .
          </EmptyState>
        </Section>
      </>
    );
  }

  const ends = (x) => new Date(x.startsAt).getTime() + x.durationMin * 60e3;
  const liveNow = data.sessions.find((x) => new Date(x.startsAt).getTime() <= now && now < ends(x));
  const kindOf = (q) => q.kind ?? "quiz";
  const counts = {
    live: data.sessions.filter((x) => ends(x) >= now).length,
    announcements: data.announcements.length,
    quizzes: data.quizzes.filter((q) => kindOf(q) === "quiz" && !q.myResult).length,
    tests: data.quizzes.filter((q) => kindOf(q) === "test" && !q.myResult).length,
    assignments: data.assignments.filter((a) => !a.mySubmission).length,
    videos: data.materials.filter((m) => m.kind === "video").length,
    materials: data.materials.filter((m) => m.kind !== "video").length,
  };

  return (
    <>
      <PageHeading
        title={course.title}
        description={data.teachers.length ? `Taught by ${data.teachers.join(", ")}` : "Self-paced"}
        action={
          <Link to={`/course/${slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Course lessons <ExternalLink className="size-3.5" />
          </Link>
        }
      />

      {liveNow && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 p-4">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-3 rounded-full bg-red-600" />
          </span>
          <p className="min-w-0 flex-1 text-sm text-slate-900 dark:text-slate-100">
            <span className="font-semibold">Live now:</span> {liveNow.title}
          </p>
          <a
            href={liveNow.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 hover:shadow-md"
          >
            <Video className="size-4" /> Join class
          </a>
        </div>
      )}

      <div role="tablist" className="-mx-6 mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setParams({ tab: t.id })}
            className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              t.id === active
                ? "border-blue-600 dark:border-blue-400 text-slate-900 dark:text-slate-100"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
            {counts[t.id] > 0 && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 text-xs text-slate-600 dark:text-slate-400">{counts[t.id]}</span>
            )}
          </button>
        ))}
      </div>

      <div key={active} className="page-enter">
        {active === "overview" && <Overview slug={slug} course={course} data={data} />}
        {active === "live" && <Live data={data} />}
        {active === "announcements" && <Announcements data={data} />}
        {active === "quizzes" && <Quizzes slug={slug} course={course} data={data} kind="quiz" />}
        {active === "tests" && <Quizzes slug={slug} course={course} data={data} kind="test" />}
        {active === "assignments" && <Assignments data={data} reload={reload} />}
        {active === "videos" && <Materials data={data} kind="video" />}
        {active === "materials" && <Materials data={data} kind="material" />}
      </div>
    </>
  );
}

function Overview({ slug, course, data }) {
  const completed = new Set(data.completedLessons);
  const total = course.lessons.length;
  return (
    <div className="space-y-6">
      <Section title={`Progress: ${completed.size} of ${total} lessons`}>
        <div className="px-5 pt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-green-600 dark:bg-green-400" style={{ width: `${(completed.size / total) * 100}%` }} />
          </div>
        </div>
        <ol className="grid gap-x-6 gap-y-1 p-5 sm:grid-cols-2">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.title}>
              <Link
                to={`/course/${slug}#lesson-${i + 1}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {completed.has(i) ? (
                  <CheckCircle2 className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
                )}
                <span className="truncate">
                  {i + 1}. {lesson.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Course quizzes">
        <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
          {course.quizzes.map((q) => {
            const result = data.builtinQuizResults[q.id];
            return (
              <li key={q.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{q.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {result ? `Best score ${result.best}/${result.total} · ${result.attempts} attempt${result.attempts === 1 ? "" : "s"}` : "Not taken yet"}
                  </p>
                </div>
                <Link to={`/course/${slug}/quiz/${q.id}`} className={buttonVariants({ size: "sm", variant: result ? "outline" : "default" })}>
                  {result ? "Retake" : "Take quiz"}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}

const kindIcons = { file: FileText, video: Video, link: Link2 };

function Materials({ data, kind }) {
  const isVideo = kind === "video";
  const items = data.materials.filter((m) => (m.kind === "video") === isVideo);
  if (items.length === 0) {
    return (
      <Section>
        <EmptyState>{isVideo ? "No videos yet." : "Your teacher hasn't shared any material yet."}</EmptyState>
      </Section>
    );
  }
  return (
    <Section>
      <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((m) => {
          const Icon = kindIcons[m.kind];
          return (
            <li key={m.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start gap-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-slate-400 dark:text-slate-500" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{m.title}</p>
                  {m.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{m.description}</p>}
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {m.kind === "link" ? new URL(m.url).hostname : `${m.fileName} · ${fileSize(m.sizeBytes)}`} · {formatDate(m.createdAt)}
                  </p>
                </div>
                {m.kind === "link" ? (
                  <a href={m.url} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
                    <ExternalLink className="size-3.5" /> Open
                  </a>
                ) : (
                  <div className="flex gap-2">
                    {m.kind !== "video" && (
                      <a href={m.url} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
                        View
                      </a>
                    )}
                    <a href={`${m.url}?download`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                      <Download className="size-3.5" /> Download
                    </a>
                  </div>
                )}
              </div>
              {m.kind === "video" && (
                <video src={m.url} controls preload="metadata" className="mt-3 aspect-video w-full rounded-md bg-black object-contain" />
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Announcements({ data }) {
  if (data.announcements.length === 0) {
    return (
      <Section>
        <EmptyState>No announcements yet.</EmptyState>
      </Section>
    );
  }
  return (
    <div className="space-y-4">
      {data.announcements.map((a) => (
        <Section key={a.id}>
          <div className="p-5">
            <p className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
              <Megaphone className="size-4 text-blue-600 dark:text-blue-400" /> {a.title}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{a.body}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {a.authorName ?? "Teacher"} · {formatDate(a.createdAt, true)}
            </p>
          </div>
        </Section>
      ))}
    </div>
  );
}

function Assignments({ data, reload }) {
  const { hash } = useLocation();
  // Links from the dashboard (#assignment-12) scroll to that assignment.
  useEffect(() => {
    if (hash.startsWith("#assignment-")) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash]);

  if (data.assignments.length === 0) {
    return (
      <Section>
        <EmptyState>No assignments yet.</EmptyState>
      </Section>
    );
  }
  return (
    <div className="space-y-4">
      {data.assignments.map((a) => (
        <SubmitAssignment key={a.id} assignment={a} onSubmitted={reload} />
      ))}
    </div>
  );
}

function Quizzes({ slug, course, data, kind }) {
  const now = useNow();
  const isTest = kind === "test";
  const items = data.quizzes.filter((q) => (q.kind ?? "quiz") === kind);
  return (
    <div className="space-y-6">
      <Section title={isTest ? "Tests" : "From your teacher"}>
        {items.length === 0 ? (
          <EmptyState>{isTest ? "No tests yet." : "No class quizzes yet."}</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {items.map((q) => {
              const status = q.myResult ? "graded" : q.dueAt && new Date(q.dueAt).getTime() < now ? "overdue" : "todo";
              return (
                <li key={q.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{q.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {plural(q.questionCount, "question")}
                      {q.timeLimitMin && ` · ${q.timeLimitMin} min`}
                      {q.maxAttempts && ` · ${q.maxAttempts} attempt${q.maxAttempts === 1 ? "" : "s"}`}
                      {q.dueAt && ` · due ${formatDate(q.dueAt, true)}`}
                      {q.myResult && ` · best ${q.myResult.best}/${q.myResult.total}`}
                    </p>
                  </div>
                  {q.myResult ? (
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">{percent(q.myResult.best / q.myResult.total)}</span>
                  ) : (
                    <DeadlineStatus status={status} />
                  )}
                  <Link to={`/my-learning/quizzes/${q.id}`} className={buttonVariants({ size: "sm", variant: q.myResult ? "outline" : "default" })}>
                    {q.myResult ? (isTest ? "View" : "Retake") : isTest ? "Open test" : "Start quiz"}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
      {!isTest && (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The course's own quizzes ({course.quizzes.length}) are on the{" "}
        <Link to={`/my-learning/courses/${slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
          Overview
        </Link>{" "}
        tab.
      </p>
      )}
    </div>
  );
}

function Live({ data }) {
  const now = useNow();
  const ends = (s) => new Date(s.startsAt).getTime() + s.durationMin * 60e3;
  const upcoming = data.sessions.filter((s) => ends(s) >= now);
  const past = data.sessions.filter((s) => ends(s) < now).reverse();

  return (
    <div className="space-y-6">
      <Section title="Upcoming">
        {upcoming.length === 0 ? (
          <EmptyState>No live classes scheduled.</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {upcoming.map((s) => {
              const live = new Date(s.startsAt).getTime() <= now;
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {s.title}
                      {live && (
                        <span className="ml-2 rounded-full bg-red-50 dark:bg-red-950/50 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                          Live now
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(s.startsAt, true)} · {s.durationMin} min · {relativeTime(s.startsAt)}
                    </p>
                    {s.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>}
                  </div>
                  <a href={s.meetingUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: live ? "default" : "outline" })}>
                    <Video className="size-4" /> Join class
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
      {past.length > 0 && (
        <Section title="Past">
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {past.map((s) => (
              <li key={s.id} className="px-5 py-3 text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-100">{s.title}</span>{" "}
                <span className="text-slate-500 dark:text-slate-400">· {formatDate(s.startsAt, true)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
