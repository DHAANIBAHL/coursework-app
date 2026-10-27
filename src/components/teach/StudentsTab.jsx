import { EmptyState, Section } from "@/components/panel/Panel";
import { formatDate, percent } from "@/lib/format";

// Who's enrolled and how each student is doing.
export default function StudentsTab({ course, data }) {
  const totalLessons = course?.lessons.length ?? 0;
  const quizTitle = (id) => course?.quizzes.find((q) => q.id === id)?.title ?? id;

  return (
    <div className="space-y-6">
      <Section title="Students">
        {data.students.length === 0 ? (
          <EmptyState>No students have joined yet. Students join from the course page.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Lessons</th>
                  <th className="px-5 py-3 text-right font-medium">Quiz average</th>
                  <th className="px-5 py-3 text-right font-medium">Submissions</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.students.map((s) => {
                  const fraction = totalLessons ? s.lessonsDone / totalLessons : 0;
                  return (
                    <tr key={s.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                        <a href={`mailto:${s.email}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                          {s.email}
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600 dark:bg-blue-400" style={{ width: `${fraction * 100}%` }} />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400">
                            {s.lessonsDone}/{totalLessons}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{percent(s.quizAverage)}</td>
                      <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{s.submissions}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{formatDate(s.enrolledAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Built-in quiz results">
        {data.builtinQuizResults.length === 0 ? (
          <EmptyState>No one has taken this course's built-in quizzes yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.builtinQuizResults.map((b) => (
              <li key={b.quizId} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-100">{quizTitle(b.quizId)}</span>
                <span className="text-slate-600 dark:text-slate-400">
                  average {percent(b.averageScore)} · {b.attempts} attempt{b.attempts === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Teachers: {data.teachers.map((t) => t.name).join(", ") || "none"}
      </p>
    </div>
  );
}
