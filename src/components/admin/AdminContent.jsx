import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PageHeading, Section } from "@/components/panel/Panel";
import { courses } from "@/data/courses";

// Built-in courses come from src/data/course-content, so this page is read-only.
export default function AdminContent() {
  return (
    <>
      <PageHeading
        title="Content"
        description="Every built-in course and how complete it is. Course text lives in the code (src/data/course-content); teachers add their own material from the teacher panel."
      />
      <Section>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 text-right font-medium">Lessons</th>
                <th className="px-5 py-3 text-right font-medium">Quizzes</th>
                <th className="px-5 py-3 text-right font-medium">Questions</th>
                <th className="px-5 py-3 text-right font-medium">Videos</th>
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
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
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/course/${c.slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View <ExternalLink className="size-3.5" />
                      </Link>
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
