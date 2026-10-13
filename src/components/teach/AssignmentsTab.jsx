import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardCheck, Download, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Loading, Section } from "@/components/panel/Panel";
import { DateTimeInput, TextArea, TextInput } from "@/components/panel/Form";
import { api, useApi } from "@/lib/api";
import { formatDate, fromLocalInput, relativeTime, toLocalInput } from "@/lib/format";

// Set work with a deadline, then grade what students hand in.
// ?grade=<id> in the URL opens that assignment's grading view.
export default function AssignmentsTab({ slug, data, reload }) {
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(null); // null, "new", or an assignment
  const [actionError, setActionError] = useState(null);
  const gradingId = Number(params.get("grade")) || null;

  function openGrading(id) {
    setParams(id ? { tab: "assignments", grade: id } : { tab: "assignments" });
  }

  async function remove(a) {
    if (!window.confirm(`Delete "${a.title}" and all ${a.submitted} submission(s)? This can't be undone.`)) return;
    try {
      await api(`/teach/assignments/${a.id}`, { method: "DELETE" });
      setActionError(null);
      if (gradingId === a.id) openGrading(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  if (gradingId) {
    return <Grading assignmentId={gradingId} onBack={() => openGrading(null)} onChange={reload} />;
  }

  return (
    <div className="space-y-6">
      {editing ? (
        <AssignmentForm
          slug={slug}
          assignment={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            reload();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" /> New assignment
        </Button>
      )}

      <ErrorNote error={actionError} />

      <Section title="Assignments">
        {data.assignments.length === 0 ? (
          <EmptyState>No assignments yet.</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {data.assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Due {formatDate(a.dueAt, true)} ({relativeTime(a.dueAt)}) · {a.maxPoints} points
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {a.submitted} handed in{a.toGrade > 0 && ` · ${a.toGrade} to grade`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => openGrading(a.id)}>
                    <ClipboardCheck className="size-3.5" /> Grade{a.toGrade > 0 && ` (${a.toGrade})`}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(a)} aria-label={`Edit ${a.title}`}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(a)} aria-label={`Delete ${a.title}`}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function AssignmentForm({ slug, assignment, onDone, onCancel }) {
  const [form, setForm] = useState({
    title: assignment?.title ?? "",
    instructions: assignment?.instructions ?? "",
    dueAt: toLocalInput(assignment?.dueAt),
    maxPoints: String(assignment?.maxPoints ?? 100),
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.instructions.trim() || !form.dueAt) {
      return setFormError("Add a title, instructions, and a due date.");
    }
    setSaving(true);
    setFormError("");
    const body = { ...form, dueAt: fromLocalInput(form.dueAt), maxPoints: Number(form.maxPoints) };
    try {
      if (assignment) await api(`/teach/assignments/${assignment.id}`, { method: "PATCH", body });
      else await api(`/teach/courses/${slug}/assignments`, { method: "POST", body });
      onDone();
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <Section
      title={assignment ? "Edit assignment" : "New assignment"}
      action={
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          <X className="size-4" />
        </button>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
        <FormError message={formError} />
        <TextInput id="as-title" label="Title" value={form.title} onChange={update("title")} placeholder="e.g. Build a landing page" />
        <TextArea id="as-instr" label="Instructions" rows={6} value={form.instructions} onChange={update("instructions")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <DateTimeInput id="as-due" label="Due" value={form.dueAt} onChange={update("dueAt")} />
          <TextInput id="as-points" label="Points" type="number" min={1} max={1000} value={form.maxPoints} onChange={update("maxPoints")} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : assignment ? "Save changes" : "Create assignment"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Section>
  );
}

function Grading({ assignmentId, onBack, onChange }) {
  const { data, error, loading, reload } = useApi(`/teach/assignments/${assignmentId}/submissions`);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  const { assignment, students } = data;
  const handedIn = students.filter((s) => s.submission);

  return (
    <div className="space-y-6">
      <div>
        <button type="button" onClick={onBack} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          ← All assignments
        </button>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{assignment.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Due {formatDate(assignment.dueAt, true)} · {assignment.maxPoints} points · {handedIn.length} of {students.length} handed in
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{assignment.instructions}</p>
      </div>

      {students.length === 0 ? (
        <Section>
          <EmptyState>No students in this course yet.</EmptyState>
        </Section>
      ) : (
        students.map((s) => (
          <GradeCard
            key={s.studentId}
            student={s}
            assignment={assignment}
            onSaved={() => {
              reload();
              onChange();
            }}
          />
        ))
      )}
    </div>
  );
}

function GradeCard({ student, assignment, onSaved }) {
  const sub = student.submission;
  const [grade, setGrade] = useState(sub?.grade ?? "");
  const [feedback, setFeedback] = useState(sub?.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const late = sub && new Date(sub.submittedAt) > new Date(assignment.dueAt);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api(`/teach/submissions/${sub.id}`, { method: "PATCH", body: { grade: Number(grade), feedback } });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section>
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              !sub
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                : sub.grade !== null
                  ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                  : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
            }`}
          >
            {!sub ? "Not handed in" : sub.grade !== null ? `Graded ${sub.grade}/${assignment.maxPoints}` : "Needs grading"}
          </span>
        </div>

        {sub && (
          <>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Handed in {formatDate(sub.submittedAt, true)}
              {late && <span className="ml-1 font-medium text-red-600 dark:text-red-400">(late)</span>}
            </p>
            {sub.textAnswer && (
              <p className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-300">
                {sub.textAnswer}
              </p>
            )}
            {sub.file && (
              <a
                href={`${sub.file.url}?download`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Download className="size-3.5" /> {sub.file.name}
              </a>
            )}
            <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-[8rem_1fr_auto] sm:items-end">
              <TextInput
                id={`g-${sub.id}`}
                label={`Points (of ${assignment.maxPoints})`}
                type="number"
                min={0}
                max={assignment.maxPoints}
                required
                value={grade}
                onChange={setGrade}
              />
              <TextInput id={`f-${sub.id}`} label="Feedback" value={feedback} onChange={setFeedback} placeholder="What went well, what to improve" />
              <Button type="submit" disabled={saving || grade === ""}>
                {saving ? "Saving…" : sub.grade !== null ? "Update grade" : "Save grade"}
              </Button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </>
        )}
      </div>
    </Section>
  );
}
