import { useState } from "react";
import { BarChart3, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Loading, Section } from "@/components/panel/Panel";
import { DateTimeInput, TextArea, TextInput } from "@/components/panel/Form";
import { api, useApi } from "@/lib/api";
import { formatDate, fromLocalInput, percent, toLocalInput } from "@/lib/format";

// Teacher-written quizzes: build, publish, and see results. Students' answers
// are graded on the server.
export default function QuizzesTab({ slug, data, reload }) {
  const [editing, setEditing] = useState(null); // null, "new", or a quiz
  const [resultsFor, setResultsFor] = useState(null);
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

  const togglePublished = (q) =>
    run(api(`/teach/quizzes/${q.id}`, { method: "PATCH", body: { published: !q.published } }));

  function remove(q) {
    if (!window.confirm(`Delete "${q.title}" and its ${q.attempts} result(s)?`)) return;
    run(api(`/teach/quizzes/${q.id}`, { method: "DELETE" }));
  }

  if (resultsFor) return <Results quizId={resultsFor} onBack={() => setResultsFor(null)} />;
  if (editing) {
    return (
      <QuizBuilder
        slug={slug}
        quiz={editing === "new" ? null : editing}
        onDone={() => {
          setEditing(null);
          reload();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setEditing("new")}>
        <Plus className="size-4" /> New quiz
      </Button>
      <ErrorNote error={actionError} />
      <Section title="Your quizzes">
        {data.quizzes.length === 0 ? (
          <EmptyState>No quizzes yet. The course's built-in quizzes are always available to students.</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {data.quizzes.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {q.title}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        q.published
                          ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {q.published ? "Published" : "Draft"}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {q.questionCount} questions{q.dueAt && ` · due ${formatDate(q.dueAt, true)}`} · {q.attempts} attempt
                    {q.attempts === 1 ? "" : "s"} · average {percent(q.averageScore)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => togglePublished(q)}>
                    {q.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {q.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setResultsFor(q.id)}>
                    <BarChart3 className="size-3.5" /> Results
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(q)} aria-label={`Edit ${q.title}`}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(q)} aria-label={`Delete ${q.title}`}>
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

const emptyQuestion = () => ({ prompt: "", options: ["", ""], correctIndex: 0, explanation: "" });

function QuizBuilder({ slug, quiz, onDone, onCancel }) {
  const [title, setTitle] = useState(quiz?.title ?? "");
  const [description, setDescription] = useState(quiz?.description ?? "");
  const [dueAt, setDueAt] = useState(toLocalInput(quiz?.dueAt));
  const [questions, setQuestions] = useState(
    quiz
      ? quiz.questions.map((q) => ({
          prompt: q.prompt,
          options: q.options.map((o) => o.text),
          correctIndex: Math.max(0, q.options.findIndex((o) => o.id === q.correct)),
          explanation: q.explanation ?? "",
        }))
      : [emptyQuestion()]
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const updateQuestion = (i, patch) => setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));

  async function save(published) {
    setFormError("");
    if (!title.trim()) return setFormError("Give the quiz a title.");
    for (const [i, q] of questions.entries()) {
      if (!q.prompt.trim() || q.options.some((o) => !o.trim())) {
        return setFormError(`Question ${i + 1} needs a question and text for every option.`);
      }
    }
    setSaving(true);
    const body = { title, description, dueAt: fromLocalInput(dueAt), questions, published };
    try {
      if (quiz) await api(`/teach/quizzes/${quiz.id}`, { method: "PATCH", body });
      else await api(`/teach/courses/${slug}/quizzes`, { method: "POST", body });
      onDone();
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <Section
      title={quiz ? "Edit quiz" : "New quiz"}
      action={
        <button type="button" onClick={onCancel} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          <X className="size-4" />
        </button>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-5 p-5">
        <FormError message={formError} />
        {quiz?.attempts > 0 && (
          <p className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-3 py-2 text-sm text-blue-600 dark:text-blue-400">
            {quiz.attempts} attempt(s) already exist. Changing answers won't re-grade them.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput id="q-title" label="Title" value={title} onChange={setTitle} placeholder="e.g. Week 2 check-in" />
          <DateTimeInput id="q-due" label="Due (optional)" value={dueAt} onChange={setDueAt} hint="Shows on students' deadlines." />
        </div>
        <TextArea id="q-desc" label="Description (optional)" rows={2} value={description} onChange={setDescription} />

        {questions.map((q, i) => (
          <fieldset key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">Question {i + 1}</legend>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
                  className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                >
                  Remove question
                </button>
              )}
            </div>
            <div className="mt-3 space-y-3">
              <TextInput id={`qp-${i}`} label="Question" value={q.prompt} onChange={(v) => updateQuestion(i, { prompt: v })} />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Options (select the correct one)</p>
                <div className="mt-1.5 space-y-2">
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correctIndex === j}
                        onChange={() => updateQuestion(i, { correctIndex: j })}
                        aria-label={`Option ${j + 1} is correct`}
                        className="accent-green-600"
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateQuestion(i, { options: q.options.map((o, k) => (k === j ? e.target.value : o)) })}
                        placeholder={`Option ${j + 1}`}
                        aria-label={`Question ${i + 1}, option ${j + 1}`}
                        className="min-w-0 flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateQuestion(i, {
                              options: q.options.filter((_, k) => k !== j),
                              correctIndex: q.correctIndex === j ? 0 : q.correctIndex > j ? q.correctIndex - 1 : q.correctIndex,
                            })
                          }
                          aria-label={`Remove option ${j + 1}`}
                          className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {q.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => updateQuestion(i, { options: [...q.options, ""] })}
                    className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add option
                  </button>
                )}
              </div>
              <TextInput
                id={`qe-${i}`}
                label="Explanation (optional)"
                value={q.explanation}
                onChange={(v) => updateQuestion(i, { explanation: v })}
                hint="Shown to students after they submit."
              />
            </div>
          </fieldset>
        ))}

        <Button type="button" variant="outline" onClick={() => setQuestions((qs) => [...qs, emptyQuestion()])}>
          <Plus className="size-4" /> Add question
        </Button>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <Button type="button" disabled={saving} onClick={() => save(true)}>
            {saving ? "Saving…" : "Save and publish"}
          </Button>
          <Button type="button" variant="outline" disabled={saving} onClick={() => save(false)}>
            Save as draft
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Section>
  );
}

function Results({ quizId, onBack }) {
  const { data, error, loading, reload } = useApi(`/teach/quizzes/${quizId}/results`);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <button type="button" onClick={onBack} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          ← All quizzes
        </button>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{data.quiz.title}: results</h2>
      </div>

      <Section title="Students">
        {data.students.length === 0 ? (
          <EmptyState>No one has taken this quiz yet.</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {data.students.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{s.name}</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">· {s.attempts} attempt{s.attempts === 1 ? "" : "s"}</span>
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  best {s.best}/{s.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="By question">
        <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
          {data.questions.map((q, i) => {
            const fraction = q.answered ? q.correct / q.answered : null;
            return (
              <li key={q.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-900 dark:text-slate-100">
                    {i + 1}. {q.prompt}
                  </span>
                  <span className="shrink-0 text-slate-600 dark:text-slate-400">{percent(fraction)} correct</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-green-600 dark:bg-green-400" style={{ width: `${(fraction ?? 0) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
