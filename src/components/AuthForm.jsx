import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";

// Page frame shared by the login and signup pages.
export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
      </main>
    </div>
  );
}

// One labelled input with an error message and an optional show/hide toggle.
export function Field({ id, label, type = "text", value, onChange, error, hint, autoComplete }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
            isPassword ? "pr-10" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

// Banner for errors that aren't about a single field (e.g. wrong password).
export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {message}
    </div>
  );
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
