import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, CircleX } from "lucide-react";
import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCourse, getQuiz } from "@/data/courses";

export default function QuizPage() {
  // Reads both parts of the URL, e.g. /course/web-design/quiz/html-foundations
  const { slug, quizId } = useParams();
  const course = getCourse(slug);
  const quiz = getQuiz(course, quizId);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold text-slate-900">Quiz not found</h1>
          <p className="mt-2 text-slate-600">
            {course ? "This course doesn't have a quiz at this address." : "There's no course at this address."}
          </p>
          <Link to={course ? `/course/${slug}` : "/"} className={`${buttonVariants()} mt-6`}>
            {course ? "Back to the course" : "Back to courses"}
          </Link>
        </main>
      </div>
    );
  }

  // The key gives each quiz fresh answers when moving from one quiz to the next.
  return <Quiz key={`${slug}/${quizId}`} course={course} quiz={quiz} />;
}

function Quiz({ course, quiz }) {
  // Chosen option id for each question, e.g. { q1: "b", q2: "c" }
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { slug, title, quizzes } = course;
  const { questions } = quiz;
  const quizNumber = quizzes.indexOf(quiz) + 1;
  const nextQuiz = quizzes[quizNumber];
  const answeredCount = Object.keys(answers).length;
  const score = questions.filter((q) => answers[q.id] === q.correct).length;

  function choose(questionId, optionId) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo(0, 0);
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to={`/course/${slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to the course
        </Link>

        <p className="mt-10 text-sm font-medium text-blue-600">
          {title} · Quiz {quizNumber} of {quizzes.length}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{quiz.title}</h1>
        <p className="mt-3 text-lg text-slate-600">
          {quiz.description} {questions.length} questions. Pick one answer for each, then check your results.
        </p>

        {submitted && (
          <div className="mt-8 rounded-lg bg-blue-50 p-6">
            <p className="text-sm font-medium text-blue-600">Your score</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {score} / {questions.length}
            </p>
            <p className="mt-1 text-slate-600">
              {score === questions.length
                ? "Perfect. You've got this section down."
                : "Review the explanations below, then give it another go."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant={nextQuiz ? "outline" : "default"} onClick={retake}>
                Retake this quiz
              </Button>
              {nextQuiz && (
                <Link to={`/course/${slug}/quiz/${nextQuiz.id}`} className={buttonVariants()}>
                  Next quiz: {nextQuiz.title}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {questions.map((question, index) => {
            const chosen = answers[question.id];
            const isCorrect = chosen === question.correct;

            return (
              <fieldset
                key={question.id}
                disabled={submitted}
                className="rounded-lg border border-slate-200 p-5"
              >
                <legend className="px-1 text-sm text-blue-600">Question {index + 1}</legend>
                <p className="font-medium text-slate-900">{question.prompt}</p>

                <div className="mt-4 space-y-2">
                  {question.options.map((option) => {
                    const selected = chosen === option.id;
                    let tone = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
                    if (!submitted && selected) tone = "border-blue-600 bg-blue-50";
                    if (submitted && option.id === question.correct) tone = "border-green-600 bg-green-50";
                    else if (submitted && selected) tone = "border-red-600 bg-red-50";

                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 rounded-md border p-3 text-slate-700 transition-colors ${tone} ${submitted ? "" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={selected}
                          onChange={() => choose(question.id, option.id)}
                          className="accent-blue-600"
                        />
                        <span className="flex-1">{option.text}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div
                    className={`mt-4 flex gap-2 text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}
                  >
                    {isCorrect ? (
                      <CircleCheck className="mt-0.5 size-4 shrink-0" />
                    ) : (
                      <CircleX className="mt-0.5 size-4 shrink-0" />
                    )}
                    <p>
                      <span className="font-medium">{isCorrect ? "Correct." : "Not quite."}</span>{" "}
                      <span className="text-slate-700">{question.explanation}</span>
                    </p>
                  </div>
                )}
              </fieldset>
            );
          })}

          {!submitted && (
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" disabled={answeredCount < questions.length}>
                Check my answers
              </Button>
              <p className="text-sm text-slate-500">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
