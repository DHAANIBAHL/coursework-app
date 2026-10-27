import { useState } from "react";
import { CalendarPlus, Sparkles, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Section } from "@/components/panel/Panel";
import { DateTimeInput, TextArea, TextInput } from "@/components/panel/Form";
import { api } from "@/lib/api";
import { formatDate, fromLocalInput, relativeTime } from "@/lib/format";
import { useNow } from "@/lib/useNow";

// Live classes run in a video-call service; the site schedules them, shows
// them to students, and links everyone to the same room.
export default function SessionsTab({ slug, data, reload }) {
  const blank = { title: "", description: "", startsAt: "", durationMin: "60", meetingUrl: "" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState(null);
  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));
  const now = useNow();

  // Jitsi Meet rooms are free and need no account: any unused room name works.
  function makeJitsiRoom() {
    const id = crypto.randomUUID().slice(0, 8);
    update("meetingUrl")(`https://meet.jit.si/coursework-${slug}-${id}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.startsAt || !form.meetingUrl.trim()) {
      return setFormError("Add a title, a start time, and a meeting link.");
    }
    setSaving(true);
    setFormError("");
    try {
      await api(`/teach/courses/${slug}/sessions`, {
        method: "POST",
        body: { ...form, startsAt: fromLocalInput(form.startsAt), durationMin: Number(form.durationMin) },
      });
      setForm(blank);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(s) {
    if (!window.confirm(`Cancel "${s.title}"? Students will no longer see it.`)) return;
    try {
      await api(`/teach/sessions/${s.id}`, { method: "DELETE" });
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  const ends = (s) => new Date(s.startsAt).getTime() + s.durationMin * 60e3;
  const upcoming = data.sessions.filter((s) => ends(s) >= now).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const past = data.sessions.filter((s) => ends(s) < now);

  return (
    <div className="space-y-6">
      <Section title="Schedule a live class">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          <FormError message={formError} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput id="s-title" label="Title" value={form.title} onChange={update("title")} placeholder="e.g. Flexbox Q&A" />
            <DateTimeInput id="s-start" label="Starts" value={form.startsAt} onChange={update("startsAt")} />
            <TextInput id="s-dur" label="Length (minutes)" type="number" min={5} max={600} value={form.durationMin} onChange={update("durationMin")} />
            <div>
              <TextInput
                id="s-url"
                label="Meeting link"
                type="url"
                value={form.meetingUrl}
                onChange={update("meetingUrl")}
                placeholder="Zoom, Google Meet, Teams, or Jitsi link"
              />
              <button
                type="button"
                onClick={makeJitsiRoom}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Sparkles className="size-3.5" /> Create a free Jitsi room (no account needed)
              </button>
            </div>
          </div>
          <TextArea id="s-desc" label="What you'll cover (optional)" rows={2} value={form.description} onChange={update("description")} />
          <Button type="submit" disabled={saving}>
            <CalendarPlus className="size-4" /> {saving ? "Scheduling…" : "Schedule class"}
          </Button>
        </form>
      </Section>

      <ErrorNote error={actionError} />

      <Section title="Upcoming">
        {upcoming.length === 0 ? (
          <EmptyState>No live classes scheduled.</EmptyState>
        ) : (
          <SessionList sessions={upcoming} onRemove={remove} now={now} live />
        )}
      </Section>
      {past.length > 0 && (
        <Section title="Past">
          <SessionList sessions={past} onRemove={remove} now={now} />
        </Section>
      )}
    </div>
  );
}

function SessionList({ sessions, onRemove, now, live }) {
  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {sessions.map((s) => {
        const started = new Date(s.startsAt).getTime() <= now;
        return (
          <li key={s.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {s.title}
                {live && started && (
                  <span className="ml-2 rounded-full bg-red-50 dark:bg-red-950/50 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                    Live now
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatDate(s.startsAt, true)} · {s.durationMin} min {live && `· ${relativeTime(s.startsAt)}`}
              </p>
              {s.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>}
            </div>
            <div className="flex gap-2">
              {live && (
                <a
                  href={s.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-white"
                >
                  <Video className="size-4" /> Start class
                </a>
              )}
              <Button variant="destructive" size="sm" onClick={() => onRemove(s)} aria-label={`Delete ${s.title}`}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
