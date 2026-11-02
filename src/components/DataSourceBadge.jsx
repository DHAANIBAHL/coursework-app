import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { hardcodedDataLoaded, useCatalogRequests } from "@/lib/dataSource";

const timeOf = (date) => date.toLocaleTimeString();

// A corner badge saying where this page's course data came from: "Source:
// MySQL" with the time it was fetched when it came from the catalog API, or
// "Source: hardcoded" if any code has loaded hardcoded course data (the old
// src/data/ files did; they are gone), so a missed page would stand out. Only
// in development or for admins; students and guests never see it. It never
// shows the database name (only the admin Data source status panel does).
export default function DataSourceBadge() {
  const { user } = useAuth();
  if (!import.meta.env.DEV && user?.role !== "admin") return null;
  return <Badge />;
}

function Badge() {
  const { pathname } = useLocation();
  const requests = useCatalogRequests(pathname);
  const [open, setOpen] = useState(false);
  const hardcoded = hardcodedDataLoaded();
  if (!hardcoded && requests.length === 0) return null; // this page shows no course data

  const latest = requests.reduce((a, r) => (!a || r.at > a ? r.at : a), null);
  const { label, Icon, tone } = hardcoded
    ? { label: "Source: hardcoded", Icon: AlertTriangle, tone: "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" }
    : { label: `Source: MySQL · fetched ${timeOf(latest)}`, Icon: Database, tone: "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300" };

  return (
    <div className="fixed bottom-3 left-3 z-40 max-w-sm text-xs" data-testid="data-source-badge" data-state={hardcoded ? "hardcoded" : "mysql"}>
      {open && (
        <div className="mb-2 rounded-md border border-slate-200 bg-white p-3 text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {hardcoded && (
            <p className="mb-2 text-red-700 dark:text-red-300">
              Hardcoded course data was loaded. Some code still imports it; <code>npm run lint</code> names the file.
            </p>
          )}
          <p className="font-medium text-slate-900 dark:text-slate-100">Course data requests on this page</p>
          {requests.length ? (
            <ul className="mt-1 space-y-0.5 font-mono">
              {requests.map((r) => (
                <li key={r.label}>
                  {timeOf(r.at)} {r.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">None.</p>
          )}
          <p className="mt-2 text-slate-500 dark:text-slate-400">Shown in development and to admins only.</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium shadow-sm ${tone}`}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    </div>
  );
}
