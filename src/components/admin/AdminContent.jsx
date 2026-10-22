import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Eye, X } from "lucide-react";
import { ErrorNote, PageHeading, Section } from "@/components/panel/Panel";
import { courses } from "@/data/courses";
import { api, useApi } from "@/lib/api";

// Built-in course text comes from src/data/course-content; this page shows how
// complete each course is and who teaches it.
export default function AdminContent() {
  const { data, error, reload } = useApi("/admin/course-teachers");
  const [actionError, setActionError] = useState(null);

  async function change(promise) {
    try {
      await promise;
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  const assign = (courseSlug, teacherId) =>
    change(api("/admin/course-teachers", { method: "POST", body: { courseSlug, teacherId: Number(teacherId) } }));
  const unassign = (courseSlug, teacherId) =>
    change(api(`/admin/course-teachers/${courseSlug}/${teacherId}`, { method: "DELETE" }));

  return (
    <>
      <PageHeading
        title="Content"
        description="Every built-in course, how complete it is, and who teaches it. Course text lives in the code (src/data/course-content); teachers add their own material from the teacher panel."
      />
      <div className="mb-4 space-y-3">
        <ErrorNote error={error} onRetry={reload} />
        <ErrorNote error={actionError} />
        {data && data.teachers.length === 0 && (
          <p className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
            There are no teacher accounts yet. Create one or change someone's role under Users, then assign them here.
          </p>
        )}
      </div>
      <Section>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 text-right font-medium">Lessons</th>
                <th className="px-5 py-3 text-right font-medium">Quizzes</th>
                <th className="px-5 py-3 text-right font-medium">Questions</th>
                <th className="px-5 py-3 text-right font-medium">Videos</th>
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Teachers</th>
                <th className="px-5 py-3 text-right font-medium">Students</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
              {courses.map((c) => {
                const videos = c.lessons.filter((l) => l.video).length;
                const questions = c.quizzes.reduce((sum, q) => sum + q.questions.length, 0);
                return (
                  <tr key={c.slug}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{c.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.tag}</p>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{c.lessons.length}</td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{c.quizzes.length}</td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{questions}</td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">
                      {videos} <span className="text-slate-400 dark:text-slate-500">/ {c.lessons.length}</span>
                    </td>
                    <td className="px-5 py-3">
                      {c.image ? (
                        <span className="text-green-700 dark:text-green-300">Yes</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">Missing</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <TeacherCell
                        slug={c.slug}
                        data={data}
                        onAssign={(id) => assign(c.slug, id)}
                        onUnassign={(id) => unassign(c.slug, id)}
                      />
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{data?.enrollments[c.slug] ?? 0}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3 whitespace-nowrap">
                        <Link
                          to={`/teach/courses/${c.slug}/student-view`}
                          className="inline-flex items-center gap-1 text-violet-700 dark:text-violet-300 hover:underline"
                        >
                          <Eye className="size-3.5" /> Student view
                        </Link>
                        <Link
                          to={`/course/${c.slug}`}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Lessons <ExternalLink className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

function TeacherCell({ slug, data, onAssign, onUnassign }) {
  if (!data) return <span className="text-slate-400 dark:text-slate-500">…</span>;
  const assigned = data.assignments.filter((a) => a.courseSlug === slug).map((a) => a.teacher);
  const available = data.teachers.filter((t) => !assigned.some((a) => a.id === t.id));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {assigned.map((t) => (
        <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 py-0.5 pl-2.5 pr-1 text-xs text-slate-700 dark:text-slate-300">
          {t.name}
          <button
            type="button"
            onClick={() => onUnassign(t.id)}
            aria-label={`Remove ${t.name} from this course`}
            className="rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <select
          value=""
          onChange={(e) => e.target.value && onAssign(e.target.value)}
          aria-label="Assign a teacher"
          className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
        >
          <option value="">+ Assign</option>
          {available.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      )}
      {assigned.length === 0 && available.length === 0 && <span className="text-xs text-slate-400 dark:text-slate-500">No teachers</span>}
    </div>
  );
}
