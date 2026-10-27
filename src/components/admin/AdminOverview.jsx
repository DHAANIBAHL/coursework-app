import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Inbox, Presentation, Shield, Users } from "lucide-react";
import { EmptyState, ErrorNote, Loading, PageHeading, Section, StatCard } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";
import { courses } from "@/data/courses";

const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
const totalQuizzes = courses.reduce((sum, c) => sum + c.quizzes.length, 0);
const totalVideos = courses.reduce((sum, c) => sum + c.lessons.filter((l) => l.video).length, 0);

export default function AdminOverview() {
  const { data, error, loading, reload } = useApi("/admin/stats");

  return (
    <>
      <PageHeading title="Overview" description="How the site is doing at a glance." />
      <ErrorNote error={error} onRetry={reload} />
      {loading && !data ? (
        <Loading />
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="All users" value={data.users.total} icon={Users} hint={`${data.signups.last7} joined this week`} />
            <StatCard label="Students" value={data.users.student} icon={GraduationCap} hint={`${data.signups.last30} sign-ups in 30 days`} />
            <StatCard label="Teachers" value={data.users.teacher} icon={Presentation} />
            <StatCard label="Admins" value={data.users.admin} icon={Shield} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section
              title="Newest accounts"
              action={
                <Link to="/admin/users" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  All users
                </Link>
              }
            >
              {data.recentUsers.length === 0 ? (
                <EmptyState>No accounts yet.</EmptyState>
              ) : (
                <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
                  {data.recentUsers.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{u.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                      </div>
                      <div className="shrink-0 text-right text-xs text-slate-500 dark:text-slate-400">
                        <p className="font-medium text-slate-700 dark:text-slate-300">{ROLE_LABELS[u.role]}</p>
                        <p>{formatDate(u.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <div className="space-y-6">
              <Section
                title="Messages"
                action={
                  <Link to="/admin/messages" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Open inbox
                  </Link>
                }
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <Inbox className="size-8 text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{data.messages.unhandled}</span>{" "}
                    waiting for a reply, out of {data.messages.total} received.
                  </p>
                </div>
              </Section>

              <Section
                title="Content"
                action={
                  <Link to="/admin/content" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    All courses
                  </Link>
                }
              >
                <dl className="grid grid-cols-2 gap-4 px-5 py-4 text-sm sm:grid-cols-4">
                  {[
                    ["Courses", courses.length],
                    ["Lessons", totalLessons],
                    ["Quizzes", totalQuizzes],
                    ["Videos", totalVideos],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                      <dd className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
                  <BookOpen className="size-3.5" /> Built-in course content lives in the code (src/data/course-content).
                </p>
              </Section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
