import { useState } from "react";
import { CalendarClock, FilePen, Megaphone, Pencil, Pin, PinOff, Send, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Section } from "@/components/panel/Panel";
import { CategoryChip, PinnedChip } from "@/components/panel/CategoryChip";
import { DateTimeInput, Select, TextArea, TextInput } from "@/components/panel/Form";
import { CATEGORIES } from "@/lib/announcements";
import { api } from "@/lib/api";
import { formatDate, fromLocalInput, relativeTime, toLocalInput } from "@/lib/format";

const whenOptions = [
  { id: "now", label: "Post now", icon: Send },
  { id: "schedule", label: "Schedule for later", icon: CalendarClock },
  { id: "draft", label: "Save as draft", icon: FilePen },
];

// Post news to the class now, schedule it for later, or keep a draft.
// Students only see an announcement once its time arrives.
export default function AnnouncementsTab({ slug, data, reload }) {
  const [editing, setEditing] = useState(null); // an announcement being edited
  // Bumped after each save so the form starts fresh (it resets by remounting).
  const [formVersion, setFormVersion] = useState(0);
  const [filter, setFilter] = useState("all");
  const [actionError, setActionError] = useState(null);

  async function run(promise) {
    try {
      await promise;
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  // Re-sends the whole announcement, changing only when it goes out.
  const postNow = (a) => run(api(`/teach/announcements/${a.id}`, { method: "PATCH", body: toBody(a, { when: "now" }) }));
  const togglePin = (a) => run(api(`/teach/announcements/${a.id}`, { method: "PATCH", body: { pinned: !a.pinned } }));
  function remove(a) {
    if (!window.confirm(`Delete the announcement "${a.title}"?`)) return;
    run(api(`/teach/announcements/${a.id}`, { method: "DELETE" }));
  }

  const scheduled = data.announcements
    .filter((a) => a.status === "scheduled")
    .sort((x, y) => new Date(x.publishAt) - new Date(y.publishAt));
  const drafts = data.announcements.filter((a) => a.status === "draft");
  const posted = data.announcements.filter((a) => a.status === "posted");
  const usedCategories = [...new Set(posted.map((a) => a.category))];
  const shownPosted = filter === "all" ? posted : posted.filter((a) => a.category === filter);

  const actions = { onPostNow: postNow, onEdit: setEditing, onDelete: remove, onPin: togglePin };

  return (
    <div className="space-y-6">
      <Composer
        key={editing ? `edit-${editing.id}` : `new-${formVersion}`}
        slug={slug}
        data={data}
        editing={editing}
        onDone={() => {
          setEditing(null);
          setFormVersion((v) => v + 1);
          reload();
        }}
        onCancel={() => setEditing(null)}
      />

      <ErrorNote error={actionError} />

      <Section title={`Scheduled (${scheduled.length})`}>
        {scheduled.length === 0 ? (
          <EmptyState>Nothing scheduled. Choose "Schedule for later" to send an announcement at a set time.</EmptyState>
        ) : (
          <List items={scheduled} {...actions} />
        )}
      </Section>

      {drafts.length > 0 && (
        <Section title={`Drafts (${drafts.length})`}>
          <List items={drafts} {...actions} />
        </Section>
      )}

      <Section
        title={`Posted (${posted.length})`}
        action={
          usedCategories.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {["all", ...usedCategories].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    filter === c
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {c === "all" ? "All" : CATEGORIES[c]?.label ?? c}
                </button>
              ))}
            </div>
          )
        }
      >
        {shownPosted.length === 0 ? <EmptyState>No announcements posted yet.</EmptyState> : <List items={shownPosted} {...actions} />}
      </Section>
    </div>
  );
}

// Builds the request body for an announcement, overriding `when`.
function toBody(a, { when, publishAt } = {}) {
  return {
    title: a.title,
    body: a.body,
    category: a.category,
    related: a.related ? { type: a.related.type, id: a.related.id } : null,
    pinned: a.pinned,
    when,
    publishAt,
  };
}

function Composer({ slug, data, editing, onDone, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [category, setCategory] = useState(editing?.category ?? "general");
  const [relatedKey, setRelatedKey] = useState(editing?.related ? `${editing.related.type}:${editing.related.id}` : "");
  const [pinned, setPinned] = useState(editing?.pinned ?? false);
  const [when, setWhen] = useState(editing ? (editing.status === "posted" ? "now" : editing.status === "draft" ? "draft" : "schedule") : "now");
  const [publishAt, setPublishAt] = useState(editing?.status === "scheduled" ? toLocalInput(editing.publishAt) : "");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const relatedItems = CATEGORIES[category]?.items?.(data) ?? [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return setFormError("Add a title and a message.");
    if (when === "schedule" && !publishAt) return setFormError("Choose when it should go out.");
    if (when === "schedule" && new Date(publishAt) <= new Date()) return setFormError("Choose a time in the future, or post it now.");
    const [type, id] = relatedKey ? relatedKey.split(":") : [];
    const payload = {
      title,
      body,
      category,
      related: type ? { type, id: Number(id) } : null,
      pinned,
      when,
      publishAt: when === "schedule" ? fromLocalInput(publishAt) : undefined,
    };
    setSaving(true);
    setFormError("");
    try {
      if (editing) await api(`/teach/announcements/${editing.id}`, { method: "PATCH", body: payload });
      else await api(`/teach/courses/${slug}/announcements`, { method: "POST", body: payload });
      onDone();
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  const submitLabel = saving ? "Saving…" : when === "schedule" ? "Schedule announcement" : when === "draft" ? "Save draft" : editing ? "Save and post" : "Post announcement";
  const SubmitIcon = whenOptions.find((w) => w.id === when).icon;

  return (
    <Section
      title={editing ? "Edit announcement" : "New announcement"}
      action={
        editing && (
          <button type="button" onClick={onCancel} aria-label="Stop editing" className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="size-4" />
          </button>
        )
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
        <FormError message={formError} />
        <TextInput id="a-title" label="Title" value={title} onChange={setTitle} placeholder="e.g. Quiz moved to Friday" />
        <TextArea id="a-body" label="Message" rows={4} value={body} onChange={setBody} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="a-category"
            label="Category"
            value={category}
            onChange={(v) => {
              setCategory(v);
              setRelatedKey("");
            }}
          >
            {Object.entries(CATEGORIES).map(([id, c]) => (
              <option key={id} value={id}>
                {c.label}
              </option>
            ))}
          </Select>
          {CATEGORIES[category]?.items && (
            <Select
              id="a-related"
              label="Link to (optional)"
              value={relatedKey}
              onChange={setRelatedKey}
              hint={relatedItems.length === 0 ? `No ${CATEGORIES[category].label.toLowerCase()} items in this course yet.` : "Students get a button that opens it."}
            >
              <option value="">Nothing specific</option>
              {relatedItems.map((item) => (
                <option key={`${item.type}:${item.id}`} value={`${item.type}:${item.id}`}>
                  {item.title}
                </option>
              ))}
            </Select>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800 dark:text-slate-200">When</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {whenOptions.map((w) => (
              <label
                key={w.id}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  when === w.id
                    ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/50 text-slate-900 dark:text-slate-100"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <input type="radio" name="a-when" checked={when === w.id} onChange={() => setWhen(w.id)} className="sr-only" />
                <w.icon className="size-4" /> {w.label}
              </label>
            ))}
          </div>
          {when === "schedule" && (
            <div className="mt-3 max-w-xs">
              <DateTimeInput id="a-at" label="Goes out at" value={publishAt} onChange={setPublishAt} hint="Students see it from this time." />
            </div>
          )}
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-blue-600" />
          Pin to the top for students
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            <SubmitIcon className="size-4" /> {submitLabel}
          </Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Section>
  );
}

function List({ items, onPostNow, onEdit, onDelete, onPin }) {
  return (
    <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
      {items.map((a) => (
        <li key={a.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
              <CategoryChip announcement={a} />
              {a.pinned && <PinnedChip />}
            </div>
            <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{a.body}</p>
            {a.related && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Links to: <span className="font-medium text-slate-700 dark:text-slate-300">{a.related.title ?? "a removed item"}</span>
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {a.status === "scheduled" && (
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Goes out {formatDate(a.publishAt, true)} ({relativeTime(a.publishAt)}) ·{" "}
                </span>
              )}
              {a.status === "draft" && <span className="font-medium text-slate-700 dark:text-slate-300">Draft · </span>}
              {a.status === "posted" && <>Posted {formatDate(a.publishAt, true)} · </>}
              {a.authorName ?? "A former teacher"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {a.status !== "posted" && (
              <Button size="sm" onClick={() => onPostNow(a)}>
                <Megaphone className="size-3.5" /> Post now
              </Button>
            )}
            {a.status === "posted" && (
              <Button variant="outline" size="sm" onClick={() => onPin(a)} aria-label={a.pinned ? "Unpin" : "Pin"}>
                {a.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEdit(a)} aria-label={`Edit ${a.title}`}>
              <Pencil className="size-3.5" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(a)} aria-label={`Delete ${a.title}`}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
