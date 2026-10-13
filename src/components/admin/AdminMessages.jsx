import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorNote, Loading, PageHeading, Section } from "@/components/panel/Panel";
import { api, useApi } from "@/lib/api";
import { formatDate } from "@/lib/format";

const tabs = [
  { id: "open", label: "Waiting" },
  { id: "handled", label: "Handled" },
  { id: "all", label: "All" },
];

export default function AdminMessages() {
  const [status, setStatus] = useState("open");
  const [actionError, setActionError] = useState(null);
  const { data, error, loading, reload } = useApi(`/admin/messages?status=${status}`);

  async function setHandled(message, handled) {
    try {
      await api(`/admin/messages/${message.id}`, { method: "PATCH", body: { handled } });
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <>
      <PageHeading title="Messages" description="Everything sent through the Contact page. Reply by email, then mark it handled." />

      <div role="tablist" className="mb-4 inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={status === t.id}
            onClick={() => setStatus(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              status === t.id
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-3">
        <ErrorNote error={error} onRetry={reload} />
        <ErrorNote error={actionError} />
      </div>

      {loading && !data ? (
        <Loading />
      ) : data?.messages.length === 0 ? (
        <Section>
          <EmptyState>{status === "open" ? "Nothing waiting. You're all caught up." : "No messages here."}</EmptyState>
        </Section>
      ) : data ? (
        <div className="space-y-4">
          {data.messages.map((m) => (
            <Section key={m.id}>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {m.name}{" "}
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        · {m.userId ? "has an account" : "not logged in"}
                      </span>
                    </p>
                    <a href={`mailto:${m.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {m.email}
                    </a>
                  </div>
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{m.topic}</p>
                    <p>{formatDate(m.createdAt, true)}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{m.message}</p>
                <div className="mt-4">
                  {m.handled ? (
                    <Button variant="outline" size="sm" onClick={() => setHandled(m, false)}>
                      <RotateCcw className="size-3.5" /> Move back to waiting
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setHandled(m, true)}>
                      <CheckCircle2 className="size-3.5" /> Mark handled
                    </Button>
                  )}
                </div>
              </div>
            </Section>
          ))}
        </div>
      ) : null}
    </>
  );
}
