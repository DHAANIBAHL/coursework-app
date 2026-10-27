import { Link } from "react-router-dom";
import {
  BarChart3,
  ClipboardCheck,
  FolderOpen,
  ListChecks,
  Megaphone,
  Presentation,
  Upload,
  Users,
  Video,
} from "lucide-react";
import { EmptyState, ErrorNote, Loading, PageHeading, Section, StatCard } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { teachingCourses } from "@/lib/teaching";
import { formatDate, percent, relativeTime } from "@/lib/format";

const linkClass = "text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline";

export default function TeachDashboard() {
  const { user } = useAuth();
  // Loaded fresh each visit, so numbers reflect grading done in a course page.
  const { data, error, loading, reload } = useApi("/teach/overview");

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  const { totals, upcomingSessions, recentSubmissions, dueSoon } = data;
  const courses = teachingCourses(data.courses);

  return (
    <>
      <PageHeading title="Teaching dashboard" description="Your classes at a glance: who's learning, what needs grading, and what's coming up." />

      {courses.length === 0 ? (
        <NotAssignedYet isAdmin={user.role === "admin"} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Students" value={totals.students} icon={Users} hint={`across ${courses.length} course${courses.length === 1 ? "" : "s"}`} />
            <StatCard label="To grade" value={totals.toGrade} icon={ClipboardCheck} hint="submissions waiting" />
            <StatCard label="Quiz average" value={percent(totals.quizAverage)} icon={BarChart3} hint={`${totals.quizAttempts} attempts`} />
            <StatCard label="Materials" value={totals.materials} icon={FolderOpen} hint="files, videos, and links" />
          </div>

          <Section title={user.role === "admin" ? "Courses with a teacher" : "Your courses"}>
            <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
              {courses.map((c) => {
                const course = getCourse(c.slug);
                return (
                  <li key={c.slug} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{course?.title ?? c.slug}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {c.students} student{c.students === 1 ? "" : "s"} · quiz average {percent(c.quizAverage)}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Link to={`/teach/courses/${c.slug}/student-view`} className={linkClass}>
                        Student view
                      </Link>
                      <Link to={`/teach/courses/${c.slug}`} className={linkClass}>
                        Manage course
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Upcoming live classes">
              {upcomingSessions.length === 0 ? (
                <EmptyState>No live classes scheduled.</EmptyState>
              ) : (
                <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                  {upcomingSessions.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{s.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {getCourse(s.courseSlug)?.title} · {formatDate(s.startsAt, true)} ({relativeTime(s.startsAt)})
                        </p>
                      </div>
                      <a href={s.meetingUrl} target="_blank" rel="noreferrer" className={`${linkClass} inline-flex shrink-0 items-center gap-1`}>
                        <Video className="size-4" /> Start
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Assignments due soon">
              {dueSoon.length === 0 ? (
                <EmptyState>Nothing due soon.</EmptyState>
              ) : (
                <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                  {dueSoon.map((a) => (
                    <li key={a.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
                        <p className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{relativeTime(a.dueAt)}</p>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                          style={{ width: `${a.enrolled ? Math.min(100, (a.submitted / a.enrolled) * 100) : 0}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {a.submitted} of {a.enrolled} handed in · {getCourse(a.courseSlug)?.title}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>

          <Section title="Recent submissions">
            {recentSubmissions.length === 0 ? (
              <EmptyState>No submissions yet.</EmptyState>
            ) : (
              <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                {recentSubmissions.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        <span className="font-medium">{s.studentName}</span> handed in <span className="font-medium">{s.assignmentTitle}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getCourse(s.courseSlug)?.title} · {relativeTime(s.submittedAt)}
                      </p>
                    </div>
                    {s.grade === null ? (
                      <Link to={`/teach/courses/${s.courseSlug}?tab=assignments&grade=${s.assignmentId}`} className={linkClass}>
                        Grade
                      </Link>
                    ) : (
                      <span className="text-sm text-green-700 dark:text-green-300">
                        {s.grade}/{s.maxPoints}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}
    </>
  );
}

// Shown to a teacher who hasn't been given a course yet: what they'll be able
// to do, and how to get started.
function NotAssignedYet({ isAdmin }) {
  const tools = [
    [Upload, "Upload material", "Share files, slides, and lesson videos, or post links."],
    [Megaphone, "Post announcements", "News that shows up on your students' dashboards."],
    [ClipboardCheck, "Set and grade assignments", "Deadlines, hand-ins, points, and feedback."],
    [ListChecks, "Write quizzes", "Multiple-choice quizzes graded automatically, with per-question results."],
    [Presentation, "Run live classes", "Schedule sessions with a Zoom, Meet, Teams, or free Jitsi link."],
    [Users, "Follow your students", "Lesson progress, quiz averages, and submissions for each student."],
  ];
  return (
    <Section>
      <div className="p-6">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isAdmin ? "No course has a teacher yet" : "You haven't been given a course yet"}
        </p>
        {isAdmin ? (
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Courses appear here once they have a teacher, with everything below.{" "}
            <Link to="/admin/content" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Assign a teacher under Admin → Content
            </Link>
            .
          </p>
        ) : (
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Once an admin assigns you a course, it appears in the sidebar with everything below. Ask an admin to add you under{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">Admin → Content → Teachers</span>.
          </p>
        )}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(([Icon, title, text]) => (
            <li key={title} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
