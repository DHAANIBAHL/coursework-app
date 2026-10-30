import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, CircleX } from "lucide-react";
import Header from "@/components/Header";
import { ErrorNote, Loading } from "@/components/panel/Panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { api, useApi } from "@/lib/api";

export default function QuizPage() {
  // Reads both parts of the URL, e.g. /course/web-design/quiz/html-foundations
  const { slug, quizId } = useParams();
  // The questions and options, without the answers: the server grades them.
  const { data, error, reload } = useApi(`/courses/${encodeURIComponent(slug)}/quizzes/${encodeURIComponent(quizId)}`);
  // useApi keeps the last result while a new one loads; ignore another quiz's.
  const loaded = data?.course.slug === slug && data?.quiz.slug === quizId ? data : null;

  if (error?.code === "QUIZ_NOT_FOUND" || error?.code === "COURSE_NOT_FOUND") {
    const courseExists = error.code === "QUIZ_NOT_FOUND";
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Quiz not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {courseExists ? "This course doesn't have a quiz at this address." : "There's no course at this address."}
          </p>
          <Link to={courseExists ? `/course/${slug}` : "/courses"} className={`${buttonVariants()} mt-6`}>
            {courseExists ? "Back to the course" : "Back to courses"}
          </Link>
        </main>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-12">{error ? <ErrorNote error={error} onRetry={reload} /> : <Loading />}</main>
      </div>
    );
  }

  // The key gives each quiz fresh answers when moving from one quiz to the next.
  return <Quiz key={`${slug}/${quizId}`} course={loaded.course} quiz={loaded.quiz} />;
}

function Quiz({ course, quiz }) {
  // Chosen option id for each question id, e.g. { 12: 47, 13: 50 }
  const [answers, setAnswers] = useState({});
  // The server's grading: { score, total, results, saved, code }. Only this
  // says which options were right, along with the explanations.
  const [graded, setGraded] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState(null);

  const { slug, title } = course;
  const { questions } = quiz;
  const answeredCount = Object.keys(answers).length;
  const submitted = graded !== null;
  const resultFor = Object.fromEntries((graded?.results ?? []).map((r) => [r.questionId, r]));

  function choose(questionId, optionId) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setChecking(true);
    setCheckError(null);
    // Graded on the server; the score is saved if the student has joined the course.
    try {
      setGraded(
        await api(`/learn/courses/${slug}/builtin-quizzes/${quiz.slug}/grade`, { method: "POST", body: { answers } })
      );
      window.scrollTo(0, 0);
    } catch (err) {
      setCheckError(err);
    } finally {
      setChecking(false);
    }
  }

  function retake() {
    setAnswers({});
    setGraded(null);
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="page-enter mx-auto max-w-3xl px-6 py-12">
        <Link
          to={`/course/${slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to the course
        </Link>

        <p className="mt-10 text-sm font-medium text-blue-600 dark:text-blue-400">
          {title} · Quiz {quiz.number} of {quiz.count}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900 dark:text-slate-100">{quiz.title}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          {quiz.description} {questions.length} questions. Pick one answer for each, then check your results.
        </p>

        {submitted && (
          <div className="mt-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-6">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Your score</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {graded.score} / {graded.total}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {graded.score === graded.total
                ? "Perfect. You've got this section down."
                : "Review the explanations below, then give it another go."}
            </p>
            {graded.saved && (
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">Saved to your progress.</p>
            )}
            {graded.code === "NOT_ENROLLED" && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <Link to={`/course/${slug}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Join this course
                </Link>{" "}
                to save your quiz scores and track your progress.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant={quiz.next ? "outline" : "default"} onClick={retake}>
                Retake this quiz
              </Button>
              {quiz.next && (
                <Link to={`/course/${slug}/quiz/${quiz.next.slug}`} className={buttonVariants()}>
                  Next quiz: {quiz.next.title}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {questions.map((question, index) => {
            const chosen = answers[question.id];
            const result = resultFor[question.id];

            return (
              <fieldset
                key={question.id}
                disabled={submitted || checking}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-5"
              >
                <legend className="px-1 text-sm text-blue-600 dark:text-blue-400">Question {index + 1}</legend>
                {/* pre-wrap keeps spaces that matter, e.g. "  hi  ".strip() */}
                <p className="whitespace-pre-wrap font-medium text-slate-900 dark:text-slate-100">{question.prompt}</p>

                <div className="mt-4 space-y-2">
                  {question.options.map((option) => {
                    const selected = chosen === option.id;
                    let tone = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800";
                    if (!submitted && selected) tone = "border-blue-600 bg-blue-50 dark:bg-blue-950/50";
                    if (submitted && option.id === result?.correctOptionId) tone = "border-green-600 bg-green-50 dark:bg-green-950/50";
                    else if (submitted && selected) tone = "border-red-600 bg-red-50 dark:bg-red-950/50";

                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 rounded-md border p-3 text-slate-700 dark:text-slate-300 transition-colors ${tone} ${submitted ? "" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={selected}
                          onChange={() => choose(question.id, option.id)}
                          className="accent-blue-600"
                        />
                        <span className="flex-1 whitespace-pre-wrap">{option.text}</span>
                      </label>
                    );
                  })}
                </div>

                {result && (
                  <div
                    className={`mt-4 flex gap-2 text-sm ${result.correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                  >
                    {result.correct ? (
                      <CircleCheck className="mt-0.5 size-4 shrink-0" />
                    ) : (
                      <CircleX className="mt-0.5 size-4 shrink-0" />
                    )}
                    <p>
                      <span className="font-medium">{result.correct ? "Correct." : "Not quite."}</span>{" "}
                      <span className="text-slate-700 dark:text-slate-300">{result.explanation}</span>
                    </p>
                  </div>
                )}
              </fieldset>
            );
          })}

          {!submitted && (
            <div className="space-y-3">
              {checkError && <ErrorNote error={checkError} />}
              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg" disabled={checking || answeredCount < questions.length}>
                  {checking ? "Checking…" : "Check my answers"}
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {answeredCount} of {questions.length} answered
                </p>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
