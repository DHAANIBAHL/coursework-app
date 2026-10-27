import { useState } from "react";
import { Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Section } from "@/components/panel/Panel";
import { TextArea, TextInput } from "@/components/panel/Form";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

// Post news to everyone in the course; it shows on their dashboards.
export default function AnnouncementsTab({ slug, data, reload }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return setFormError("Add a title and a message.");
    setSaving(true);
    setFormError("");
    try {
      await api(`/teach/courses/${slug}/announcements`, { method: "POST", body: { title, body } });
      setTitle("");
      setBody("");
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(a) {
    if (!window.confirm(`Delete the announcement "${a.title}"?`)) return;
    try {
      await api(`/teach/announcements/${a.id}`, { method: "DELETE" });
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <div className="space-y-6">
      <Section title="New announcement">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          <FormError message={formError} />
          <TextInput id="a-title" label="Title" value={title} onChange={setTitle} placeholder="e.g. Quiz moved to Friday" />
          <TextArea id="a-body" label="Message" rows={4} value={body} onChange={setBody} />
          <Button type="submit" disabled={saving}>
            <Megaphone className="size-4" /> {saving ? "Posting…" : "Post announcement"}
          </Button>
        </form>
      </Section>

      <ErrorNote error={actionError} />

      <Section title="Posted">
        {data.announcements.length === 0 ? (
          <EmptyState>No announcements yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.announcements.map((a) => (
              <li key={a.id} className="flex items-start gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{a.body}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {a.authorName ?? "A former teacher"} · {formatDate(a.createdAt, true)}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => remove(a)} aria-label={`Delete ${a.title}`}>
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
