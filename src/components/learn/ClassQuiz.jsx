import { useEffect, useEffectEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CircleCheck, CircleX, Clock, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Loading, PageHeading, Section } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { api, useApi } from "@/lib/api";
import { formatDate, plural } from "@/lib/format";
import { useNow } from "@/lib/useNow";

// Take a quiz or a test written by a teacher. Answers come back from the server
// only after submitting. Tests show their questions only once started, run on a
// server-side clock, and submit automatically when time runs out.
export default function ClassQuiz() {
  const { id } = useParams();
  const { data, error, loading, reload } = useApi(`/learn/quizzes/${id}`);
  const [started, setStarted] = useState(null); // { quiz, session } after pressing Start
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const now = useNow(1000);

  const quiz = started?.quiz ?? data?.quiz;
  const session = started?.session ?? data?.session ?? null;
  const isTest = quiz?.kind === "test";
  const endsAt = session ? new Date(session.endsAt).getTime() : null;
  const secondsLeft = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : null;
  const inProgress = !result && (!isTest || Boolean(session));

  async function submit() {
    setSubmitting(true);
    setActionError(null);
    try {
      const graded = await api(`/learn/quizzes/${quiz.id}/attempts`, { method: "POST", body: { answers } });
      // Keep this attempt's questions: a finished test no longer sends them.
      setResult({ ...graded, questions: quiz.questions });
      setStarted(null);
      window.scrollTo(0, 0);
      reload();
    } catch (err) {
      setActionError(
        err.code === "TIME_UP" ? new Error("Time ran out before your answers reached the server, so this attempt wasn't counted.") : err
      );
      if (err.code === "TIME_UP") {
        setStarted(null);
        reload();
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Tests submit themselves when the clock reaches zero. useEffectEvent lets the
  // timer call the latest submit(), so it sends the answers given so far.
  const onTimeUp = useEffectEvent(() => submit());
  useEffect(() => {
    if (!endsAt || result) return;
    const timer = setTimeout(() => onTimeUp(), Math.max(0, endsAt - Date.now()));
    return () => clearTimeout(timer);
  }, [endsAt, result]);

  async function startTest() {
    setActionError(null);
    try {
      setStarted(await api(`/learn/quizzes/${quiz.id}/start`, { method: "POST" }));
      setAnswers({});
    } catch (err) {
      setActionError(err);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
    window.scrollTo(0, 0);
  }

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} onRetry={reload} />;

  const course = getCourse(quiz.courseSlug);
  const { attempts, attemptsLeft } = data;
  const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : null;
  const noAttemptsLeft = attemptsLeft === 0 && !session;
  const answered = Object.keys(answers).length;
  const resultFor = (qid) => result?.results.find((r) => r.id === qid);
  const shownQuestions = result?.questions ?? quiz.questions;
  const backTo = `/my-learning/courses/${quiz.courseSlug}?tab=${isTest ? "tests" : "quizzes"}`;
  const clock =
    secondsLeft === null ? null : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <>
      <Link to={backTo} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
        ← {course?.title ?? "Back"}
      </Link>
      <div className="mt-3">
        <PageHeading
          title={quiz.title}
          description={[
            plural(quiz.questionCount, "question"),
            quiz.timeLimitMin && plural(quiz.timeLimitMin, "minute"),
            quiz.maxAttempts && `${quiz.maxAttempts} attempt${quiz.maxAttempts === 1 ? "" : "s"}`,
            quiz.dueAt && `due ${formatDate(quiz.dueAt, true)}`,
            best !== null && `your best so far: ${best}/${quiz.questionCount}`,
          ]
            .filter(Boolean)
            .join(" · ")}
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
          {(data.attemptsLeft === null || data.attemptsLeft > 0) && (
            <Button className="mt-4" variant="outline" onClick={isTest ? () => setResult(null) : retake}>
              {isTest ? "Back to the test page" : "Retake"}
            </Button>
          )}
        </div>
      )}

      <div className="mb-4">
        <ErrorNote error={actionError} />
      </div>

      {/* Before a test starts: what to expect, then Start. */}
      {isTest && !session && !result && (
        <Section>
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <FlaskConical className="size-10 text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {noAttemptsLeft ? "You've used all your attempts" : "Ready when you are"}
            </p>
            <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
              {noAttemptsLeft
                ? best !== null
                  ? `Your best score is ${best}/${quiz.questionCount}.`
                  : "This test is closed for you."
                : `You'll have ${plural(quiz.timeLimitMin, "minute")} for ${plural(quiz.questionCount, "question")} once you press Start. Your answers are sent automatically when time runs out.${
                    attemptsLeft !== null ? ` Attempts left: ${attemptsLeft}.` : ""
                  }`}
            </p>
            {!noAttemptsLeft && (
              <Button size="lg" className="mt-6 h-11 px-6" onClick={startTest}>
                Start test
              </Button>
            )}
          </div>
        </Section>
      )}

      {!isTest && noAttemptsLeft && !result && (
        <Section>
          <p className="px-5 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
            You've used all {quiz.maxAttempts} attempts for this quiz. Your best score is {best}/{quiz.questionCount}.
          </p>
        </Section>
      )}

      {/* The questions: while answering, or with results after submitting. */}
      {((inProgress && !noAttemptsLeft) || result) && shownQuestions.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-5"
        >
          {isTest && inProgress && clock && (
            <div
              className={`sticky top-[calc(env(safe-area-inset-top,0px)+4.5rem)] z-10 flex items-center justify-between rounded-lg border px-4 py-2.5 shadow-sm backdrop-blur ${
                secondsLeft <= 60
                  ? "border-red-200 dark:border-red-900 bg-red-50/95 dark:bg-red-950/90 text-red-700 dark:text-red-300"
                  : "border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300"
              }`}
              role="timer"
              aria-live="off"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" /> Time left
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums">{clock}</span>
            </div>
          )}

          {shownQuestions.map((q, index) => {
            const r = resultFor(q.id);
            return (
              <fieldset
                key={q.id}
                disabled={Boolean(result) || submitting}
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
                      <label
                        key={o.id}
                        className={`flex items-center gap-3 rounded-md border p-3 text-slate-700 dark:text-slate-300 transition-colors ${tone} ${result ? "" : "cursor-pointer"}`}
                      >
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
              {/* Tests can be handed in with blanks; quizzes need every answer. */}
              <Button type="submit" size="lg" disabled={submitting || (!isTest && answered < quiz.questions.length)}>
                {submitting ? "Checking…" : isTest ? "Hand in test" : "Submit answers"}
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {answered} of {quiz.questions.length} answered
              </p>
            </div>
          )}
        </form>
      )}
    </>
  );
}
