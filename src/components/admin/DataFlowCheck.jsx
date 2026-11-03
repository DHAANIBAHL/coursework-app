import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { ErrorNote, Loading, Section } from "@/components/panel/Panel";
import { useApi } from "@/lib/api";

// Admin → Overview: checks that the course catalog database and the live
// database still fit together (GET /api/health/data-flow). The live database
// refers to courses and quizzes by slug and to lessons by position, so things
// like an unpublished course or a removed lesson can leave data pointing at
// nothing. Each check shows how many rows are affected and a few examples.
const levels = {
  ok: { Icon: CheckCircle2, tone: "text-green-600 dark:text-green-400" },
  warning: { Icon: AlertTriangle, tone: "text-amber-600 dark:text-amber-400" },
  error: { Icon: XCircle, tone: "text-red-600 dark:text-red-400" },
};

export default function DataFlowCheck() {
  const { data, error, loading, reload } = useApi("/health/data-flow");

  return (
    <Section
      title="Data flow check"
      action={
        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-60 disabled:no-underline"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin motion-reduce:animate-none" : ""}`} />
          {loading ? "Checking…" : "Run again"}
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
          <Summary data={data} />
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800" data-testid="data-flow-checks">
            {data.checks.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </ul>
          <p className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Compares the course catalog with enrollments, progress, scores, teachers and classroom items</span>
            <span>Took {data.queryMs} ms</span>
            <span>Last run {new Date(data.checkedAt).toLocaleTimeString()}</span>
          </p>
        </>
      )}
    </Section>
  );
}

function Summary({ data }) {
  const failing = data.checks.filter((c) => c.count > 0);
  const errors = failing.filter((c) => c.level === "error").length;
  const tone = failing.length === 0
    ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
    : errors
      ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
      : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300";
  const text = failing.length === 0
    ? `All ${data.checks.length} checks pass: the catalog and the live data agree.`
    : `${failing.length} of ${data.checks.length} checks found problems${errors ? ` (${errors} need${errors === 1 ? "s" : ""} fixing)` : ""}.`;
  return (
    <p role="status" className={`mx-5 mt-4 mb-2 rounded-md px-4 py-2.5 text-sm font-medium ${tone}`}>
      {text}
    </p>
  );
}

function CheckRow({ check }) {
  const { Icon, tone } = levels[check.count > 0 ? check.level : "ok"];
  return (
    <li className="flex gap-3 px-5 py-3" data-check={check.id} data-count={check.count}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{check.title}</p>
          <span className={`text-sm font-semibold ${check.count > 0 ? tone : "text-slate-400 dark:text-slate-500"}`}>
            {check.count > 0 ? `${check.count} affected` : "OK"}
          </span>
        </div>
        {check.count > 0 && (
          <>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{check.help}</p>
            <ul className="mt-2 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
              {check.examples.map((example) => (
                <li key={example} className="truncate">
                  · {example}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </li>
  );
}
