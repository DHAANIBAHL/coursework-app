import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Loading, PageHeading } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { api, useApi } from "@/lib/api";
import { formatDate } from "@/lib/format";

// Take a quiz written by a teacher. The answers come back from the server only
// after submitting, so they can't be looked up in the page beforehand.
export default function ClassQuiz() {
  const { id } = useParams();
  const { data, error, loading, reload } = useApi(`/learn/quizzes/${id}`);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  const { quiz, attempts } = data;
  const course = getCourse(quiz.courseSlug);
  const answered = Object.keys(answers).length;
  const resultFor = (qid) => result?.results.find((r) => r.id === qid);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      setResult(await api(`/learn/quizzes/${quiz.id}/attempts`, { method: "POST", body: { answers } }));
      window.scrollTo(0, 0);
      reload();
    } catch (err) {
      setSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <Link
        to={`/my-learning/courses/${quiz.courseSlug}?tab=quizzes`}
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← {course?.title ?? "Back"}
      </Link>
      <div className="mt-3">
        <PageHeading
          title={quiz.title}
          description={`${quiz.questionCount} questions${quiz.dueAt ? ` · due ${formatDate(quiz.dueAt, true)}` : ""}${
            attempts.length ? ` · your best so far: ${Math.max(...attempts.map((a) => a.score))}/${quiz.questionCount}` : ""
          }`}
        />
      </div>
      {quiz.description && <p className="-mt-2 mb-6 text-slate-600 dark:text-slate-400">{quiz.description}</p>}

      {result && (
        <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-6">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Your score</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result.score} / {result.total}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Saved. Your teacher can see your result.</p>
          <Button className="mt-4" variant="outline" onClick={retake}>
            Retake
          </Button>
        </div>
      )}

      <ErrorNote error={submitError} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {quiz.questions.map((q, index) => {
          const r = resultFor(q.id);
          return (
            <fieldset
              key={q.id}
              disabled={Boolean(result)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            >
              <legend className="px-1 text-sm text-blue-600 dark:text-blue-400">Question {index + 1}</legend>
              <p className="font-medium text-slate-900 dark:text-slate-100">{q.prompt}</p>
              <div className="mt-4 space-y-2">
                {q.options.map((o) => {
                  const selected = answers[q.id] === o.id;
                  let tone = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600";
                  if (!result && selected) tone = "border-blue-600 bg-blue-50 dark:bg-blue-950/50";
                  if (r && o.id === r.correct) tone = "border-green-600 bg-green-50 dark:bg-green-950/50";
                  else if (r && selected) tone = "border-red-600 bg-red-50 dark:bg-red-950/50";
                  return (
                    <label key={o.id} className={`flex items-center gap-3 rounded-md border p-3 text-slate-700 dark:text-slate-300 ${tone} ${result ? "" : "cursor-pointer"}`}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                        className="accent-blue-600"
                      />
                      <span className="flex-1">{o.text}</span>
                    </label>
                  );
                })}
              </div>
              {r && (
                <div className={`mt-4 flex gap-2 text-sm ${r.chosen === r.correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                  {r.chosen === r.correct ? <CircleCheck className="mt-0.5 size-4 shrink-0" /> : <CircleX className="mt-0.5 size-4 shrink-0" />}
                  <p>
                    <span className="font-medium">{r.chosen === r.correct ? "Correct." : r.chosen ? "Not quite." : "Not answered."}</span>{" "}
                    {r.explanation && <span className="text-slate-700 dark:text-slate-300">{r.explanation}</span>}
                  </p>
                </div>
              )}
            </fieldset>
          );
        })}

        {!result && (
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={submitting || answered < quiz.questions.length}>
              {submitting ? "Checking…" : "Submit answers"}
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {answered} of {quiz.questions.length} answered
            </p>
          </div>
        )}
      </form>
    </>
  );
}
