import { NavLink, Outlet } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";

// Shared building blocks for the admin, teacher, and student areas.

// Page frame with a sidebar on desktop and scrollable tabs on phones.
// `items`: [{ to, label, icon, end }] — `end` makes "/admin" match only itself.
// `context` is passed to the child page (read it with useOutletContext()).
export function PanelLayout({ title, items, context, footer }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-8 md:flex md:gap-8">
        <aside className="md:w-56 md:shrink-0">
          <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 md:block">
            {title}
          </p>
          <nav className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-4 md:mx-0 md:flex-col md:px-0 md:pb-0">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          {footer}
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet context={context} />
        </main>
      </div>
    </div>
  );
}

export function PageHeading({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        {description && <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// A number with a label, e.g. "Students 42". `hint` is a small line under it.
export function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {Icon && <Icon className="size-4 text-slate-400 dark:text-slate-500" />}
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

// A white box with an optional title row, for grouping content on a panel page.
export function Section({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 px-5 py-3">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Loading() {
  return (
    <p className="flex items-center gap-2 py-10 text-sm text-slate-500 dark:text-slate-400">
      <Loader2 className="size-4 animate-spin" /> Loading…
    </p>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
      <AlertCircle className="size-4 shrink-0" />
      <span className="flex-1">{error.message ?? String(error)}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-medium underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ children }) {
  return <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">{children}</p>;
}
