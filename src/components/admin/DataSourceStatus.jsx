import { RefreshCw } from "lucide-react";
import { ErrorNote, Loading, Section } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";

// Admin → Overview: which database the course catalog is read from, with live
// counts and the query time (GET /api/health/data-source).
export default function DataSourceStatus() {
  const { data, error, loading, reload } = useApi("/health/data-source");

  return (
    <Section
      title="Data source status"
      action={
        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-60 disabled:no-underline"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin motion-reduce:animate-none" : ""}`} />
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      }
    >
      {error ? (
        <div className="px-5 py-4">
          <ErrorNote error={error} onRetry={reload} />
        </div>
      ) : !data ? (
        <div className="px-5">
          <Loading />
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4 px-5 py-4 text-sm sm:grid-cols-4">
            {[
              ["Courses", data.counts.courses],
              ["Modules", data.counts.modules],
              ["Lessons", data.counts.lessons],
              ["Quizzes", data.counts.quizzes],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                <dd className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Database <code className="font-medium text-slate-700 dark:text-slate-300">{data.database}</code>
            </span>
            <span>Query took {data.queryMs} ms</span>
            <span>Last fetched {new Date(data.checkedAt).toLocaleTimeString()}</span>
          </p>
        </>
      )}
    </Section>
  );
}
