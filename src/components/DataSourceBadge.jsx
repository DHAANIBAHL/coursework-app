import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, Database, Info } from "lucide-react";
import { hardcodedDataLoaded, useCatalogRequests } from "@/lib/dataSource";

// Development only (App renders it under import.meta.env.DEV): a corner badge
// saying where this page's course data came from. Green when it came from the
// catalog API, red when any code has loaded the hardcoded src/data/ files.
// Click it to list the catalog requests this page made.
export default function DataSourceBadge() {
  const { pathname } = useLocation();
  const requests = useCatalogRequests(pathname);
  const [open, setOpen] = useState(false);
  const hardcoded = hardcodedDataLoaded();

  const state = hardcoded
    ? { label: "Hardcoded data loaded", Icon: AlertTriangle, tone: "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" }
    : requests.length
      ? { label: "Catalog: API", Icon: Database, tone: "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300" }
      : { label: "No catalog data on this page", Icon: Info, tone: "border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400" };

  return (
    <div className="fixed bottom-3 left-3 z-40 max-w-sm text-xs" data-testid="data-source-badge" data-state={hardcoded ? "hardcoded" : requests.length ? "api" : "none"}>
      {open && (
        <div className="mb-2 rounded-md border border-slate-200 bg-white p-3 text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {hardcoded && (
            <p className="mb-2 text-red-700 dark:text-red-300">
              src/data/courses.js was loaded. Some code still imports it; <code>npm run lint</code> names the file.
            </p>
          )}
          <p className="font-medium text-slate-900 dark:text-slate-100">Catalog requests on this page</p>
          {requests.length ? (
            <ul className="mt-1 space-y-0.5 font-mono">
              {requests.map((label, i) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">None.</p>
          )}
          <p className="mt-2 text-slate-500 dark:text-slate-400">Shown in development only.</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium shadow-sm ${state.tone}`}
      >
        <state.Icon className="size-3.5" />
        {state.label}
        {!hardcoded && requests.length > 0 && <span className="opacity-70">({requests.length})</span>}
      </button>
    </div>
  );
}
