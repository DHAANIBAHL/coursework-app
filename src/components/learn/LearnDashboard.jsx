import { Link } from "react-router-dom";
import { BarChart3, BookOpen, CalendarClock, CheckCircle2, Megaphone, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, ErrorNote, Loading, PageHeading, Section, StatCard } from "@/components/panel/Panel";
import DeadlineStatus from "@/components/learn/DeadlineStatus";
import { CategoryChip, PinnedChip } from "@/components/panel/CategoryChip";
import { relatedLinkForStudent } from "@/lib/announcements";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { useCatalog } from "@/lib/catalog";
import { formatDate, percent, relativeTime } from "@/lib/format";
import { nextLessonIndex } from "@/lib/learning";
import { useNow } from "@/lib/useNow";

const linkClass = "text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline";

// The student home page: progress, what's due, live classes, news, and grades.
export default function LearnDashboard() {
  const { user } = useAuth();
  const dashboard = useApi("/learn/dashboard");
  const enrollments = useApi("/learn/enrollments");
  const now = useNow();
  const catalog = useCatalog();

  const loading = (dashboard.loading && !dashboard.data) || (enrollments.loading && !enrollments.data);
  if (loading || catalog.loading) return <Loading />;
  const error = dashboard.error ?? enrollments.error ?? catalog.error;
  if (error) {
    return (
      <ErrorNote
        error={error}
        onRetry={() => {
          dashboard.reload();
          enrollments.reload();
          catalog.reload();
        }}
      />
    );
  }

  const { stats, deadlines, sessions, announcements, recentGrades } = dashboard.data;
  const courses = enrollments.data.enrollments.filter((e) => catalog.courseBySlug(e.slug));
  const titleOf = (slug) => catalog.courseBySlug(slug)?.title ?? slug;
  const open = deadlines.filter((d) => d.status === "todo" || d.status === "overdue");
  const done = deadlines.filter((d) => d.status === "submitted" || d.status === "graded");
  const firstName = user.name.split(" ")[0];

  if (courses.length === 0) {
    return (
      <>
        <PageHeading title={`Welcome, ${firstName}`} />
        <Section>
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <BookOpen className="size-10 text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">You haven't joined a course yet</p>
            <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
              Join a course to track your progress, save quiz scores, and get class material, assignments, and live classes.
            </p>
            <Link to="/courses" className={`${buttonVariants()} mt-6`}>
              Browse courses
            </Link>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeading title={`Welcome back, ${firstName}`} description="Here's where you are and what's coming up." />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Courses" value={stats.courses} icon={BookOpen} />
          <StatCard label="Lessons done" value={stats.lessonsDone} icon={CheckCircle2} />
          <StatCard label="Quiz average" value={percent(stats.quizAverage)} icon={BarChart3} hint={`${stats.quizzesTaken} quizzes taken`} />
          <StatCard label="Due" value={stats.due} icon={CalendarClock} hint={`${stats.submitted} handed in so far`} />
        </div>

        <Section title="Continue learning">
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {courses.map((e) => {
              const course = catalog.courseBySlug(e.slug);
              const total = course.lessonCount;
              const completed = new Set(e.completedLessons ?? []);
              const next = nextLessonIndex(total, completed);
              const finished = completed.size >= total;
              return (
                <li key={e.slug} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt="" className="hidden h-14 w-20 rounded-md object-cover sm:block" />
                  ) : (
                    <div className={`hidden h-14 w-20 rounded-md sm:block ${course.color}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{course.title}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 max-w-xs flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-green-600 dark:bg-green-400" style={{ width: `${(completed.size / total) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {completed.size}/{total} lessons
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/my-learning/courses/${e.slug}`} className={linkClass}>
                      Classroom
                    </Link>
                    <Link to={`/course/${e.slug}#lesson-${next + 1}`} className={buttonVariants({ size: "sm" })}>
                      {finished ? "Review" : completed.size === 0 ? "Start" : `Lesson ${next + 1}`}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Deadlines">
            {open.length === 0 ? (
              <EmptyState>Nothing due. You're all caught up.</EmptyState>
            ) : (
              <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {open.map((d) => (
                  <DeadlineRow titleOf={titleOf} key={`${d.type}-${d.id}`} d={d} />
                ))}
              </ul>
            )}
            {done.length > 0 && (
              <details className="border-t border-slate-200 dark:border-slate-800">
                <summary className="cursor-pointer px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                  Recently handed in ({done.length})
                </summary>
                <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                  {done.map((d) => (
                    <DeadlineRow titleOf={titleOf} key={`${d.type}-${d.id}`} d={d} />
                  ))}
                </ul>
              </details>
            )}
          </Section>

          <Section title="Live classes">
            {sessions.length === 0 ? (
              <EmptyState>No live classes in the next 30 days.</EmptyState>
            ) : (
              <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {sessions.map((s) => {
                  const live = new Date(s.startsAt).getTime() <= now;
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {s.title}
                          {live && (
                            <span className="ml-2 rounded-full bg-red-50 dark:bg-red-950/50 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                              Live now
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {titleOf(s.courseSlug)} · {formatDate(s.startsAt, true)} ({relativeTime(s.startsAt)})
                        </p>
                      </div>
                      <a
                        href={s.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${buttonVariants({ size: "sm", variant: live ? "default" : "outline" })} shrink-0`}
                      >
                        <Video className="size-3.5" /> Join
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Announcements">
            {announcements.length === 0 ? (
              <EmptyState>No announcements yet.</EmptyState>
            ) : (
              <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {announcements.map((a) => (
                  <li key={a.id} className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        <Megaphone className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                        {a.title}
                      </p>
                      <CategoryChip announcement={a} />
                      {a.pinned && <PinnedChip />}
                    </div>
                    <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">{a.body}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {titleOf(a.courseSlug)} · {a.authorName ?? "Teacher"} · {relativeTime(a.publishAt ?? a.createdAt)}
                      {relatedLinkForStudent(a) && (
                        <>
                          {" · "}
                          <Link to={relatedLinkForStudent(a)} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Open {a.related.title ?? "it"}
                          </Link>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Recent grades">
            {recentGrades.length === 0 ? (
              <EmptyState>Grades from your teachers will show up here.</EmptyState>
            ) : (
              <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {recentGrades.map((g) => (
                  <li key={g.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{g.assignmentTitle}</p>
                      <p className="shrink-0 text-sm font-semibold text-green-700 dark:text-green-300">
                        {g.grade}/{g.maxPoints}
                      </p>
                    </div>
                    {g.feedback && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">"{g.feedback}"</p>}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{titleOf(g.courseSlug)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}

function DeadlineRow({ d, titleOf }) {
  const to =
    d.type === "quiz" || d.type === "test"
      ? `/my-learning/quizzes/${d.id}`
      : `/my-learning/courses/${d.courseSlug}?tab=assignments#assignment-${d.id}`;
  return (
    <li>
      <Link to={to} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {d.title} <span className="font-normal text-slate-500 dark:text-slate-400">· {{ quiz: "Quiz", test: "Test" }[d.type] ?? "Assignment"}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {titleOf(d.courseSlug)} · due {formatDate(d.dueAt, true)} ({relativeTime(d.dueAt)})
          </p>
        </div>
        <DeadlineStatus status={d.status} />
      </Link>
    </li>
  );
}
