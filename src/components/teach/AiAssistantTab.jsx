import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, FlaskConical, ListChecks, Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Section } from "@/components/panel/Panel";
import { api, useApi } from "@/lib/api";

// A chat where teachers describe a topic and get multiple-choice questions back
// from the AI (Gemini, OpenAI, Claude, or Groq, called by the server). Generated quizzes can be saved as a
// draft quiz or test, then reviewed and published from those sections.
// The conversation is kept for the browser tab in sessionStorage.

const storageKey = (slug) => `coursework-ai-chat:${slug}`;

function loadChat(slug) {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey(slug))) ?? [];
  } catch {
    return [];
  }
}

function saveChat(slug, messages) {
  try {
    sessionStorage.setItem(storageKey(slug), JSON.stringify(messages));
  } catch {
    // Storage unavailable (e.g. private mode): the chat still works for now.
  }
}

export default function AiAssistantTab({ slug, course, reload }) {
  const status = useApi("/teach/ai/status");
  const [messages, setMessages] = useState(() => loadChat(slug)); // [{ role, content, quiz?, saved? }]
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    saveChat(slug, messages);
  }, [slug, messages]);
  // Braces matter: newer browsers return a Promise from scrollIntoView, and an
  // effect may only return a cleanup function.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, thinking]);

  const lessons = course?.lessons.map((l) => l.title) ?? [];
  const suggestions = [
    lessons[0] && `5 beginner questions on ${lessons[0]}`,
    lessons[7] && `8 medium questions on ${lessons[7]}`,
    lessons[11] && `A 10-question test on ${lessons[11]} and ${lessons[12] ?? lessons[10]}`,
    "Make a quiz covering the whole course",
  ].filter(Boolean);

  async function send(text) {
    const content = text.trim();
    if (!content || thinking) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setThinking(true);
    setError(null);
    try {
      const answer = await api("/teach/ai/quiz-chat", {
        method: "POST",
        body: {
          courseSlug: slug,
          courseTitle: course?.title,
          lessonTitles: lessons,
          // Earlier AI turns go back as the JSON they came from, so the AI
          // can change a quiz it already made ("make it harder").
          messages: next.map((m) =>
            m.role === "assistant" ? { role: "assistant", content: JSON.stringify({ reply: m.content, quiz: m.quiz ?? null }) } : m
          ),
        },
      });
      setMessages([...next, { role: "assistant", content: answer.reply, quiz: answer.quiz }]);
    } catch (err) {
      setError(err);
    } finally {
      setThinking(false);
    }
  }

  function clearChat() {
    if (messages.length && !window.confirm("Start a new conversation? This one will be cleared.")) return;
    setMessages([]);
    setError(null);
  }

  const notConfigured = status.data && !status.data.configured;

  return (
    <div className="space-y-4">
      <Section
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-600 dark:text-blue-400" /> AI quiz assistant
          </span>
        }
        action={
          messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <RotateCcw className="size-3.5" /> New chat
            </Button>
          )
        }
      >
        {notConfigured && (
          <div className="m-5 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 p-4 text-sm text-amber-800 dark:text-amber-300">
            <p className="font-medium">The assistant isn't set up yet.</p>
            <p className="mt-1">
              Add an AI key to <code className="font-mono">coursework-server/.env</code>, then restart the server. The simplest free option is a
              Gemini key from aistudio.google.com as <code className="font-mono">GEMINI_API_KEY=…</code>; <code className="font-mono">OPENAI_API_KEY</code>,{" "}
              <code className="font-mono">ANTHROPIC_API_KEY</code>, and <code className="font-mono">GROQ_API_KEY</code> work too.
            </p>
          </div>
        )}

        <div className="max-h-[60vh] min-h-64 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="py-6 text-center">
              <Sparkles className="mx-auto size-8 text-blue-600 dark:text-blue-400" />
              <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">Tell me a topic and I'll write the questions.</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Say how many questions and how hard. You can then ask for changes, like "make them harder" or "add 3 more".
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={notConfigured}
                    onClick={() => send(s)}
                    className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2 text-sm text-white">{m.content}</p>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Sparkles className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="w-fit max-w-full whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-800 dark:text-slate-200">
                    {m.content}
                  </p>
                  {m.quiz && (
                    <QuizPreview
                      slug={slug}
                      quiz={m.quiz}
                      saved={m.saved}
                      // Remember it was saved (kept with the chat), so a reload
                      // doesn't offer to save the same quiz twice.
                      onSaved={(kind) => setMessages((ms) => ms.map((x, j) => (j === i ? { ...x, saved: kind } : x)))}
                      reload={reload}
                    />
                  )}
                </div>
              </div>
            )
          )}

          {thinking && (
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Loader2 className="size-4 animate-spin" />
              </span>
              Writing questions…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="px-5 pb-3">
            <ErrorNote error={error} />
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-end gap-2 border-t border-slate-200 dark:border-slate-800 p-4"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends; Shift+Enter adds a new line.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={2}
            disabled={notConfigured}
            placeholder={notConfigured ? "Set up an AI key to start." : "e.g. 6 medium questions on CSS Grid, focused on grid-template-columns"}
            aria-label="Message the quiz assistant"
            className="min-h-11 flex-1 resize-y rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60"
          />
          <Button type="submit" disabled={thinking || !draft.trim() || notConfigured} className="h-11 px-4">
            <Send className="size-4" /> Send
          </Button>
        </form>
      </Section>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {status.data?.provider ? `Powered by ${status.data.provider} (${status.data.model}). ` : ""}AI can make mistakes. Quizzes are saved as drafts so you can
        check every answer before students see them.
      </p>
    </div>
  );
}

// A generated quiz: every question with the correct answer marked, and buttons
// to save it as a draft quiz or test.
function QuizPreview({ slug, quiz, saved, onSaved, reload }) {
  const [, setParams] = useSearchParams();
  const [saving, setSaving] = useState(null); // "quiz" | "test" while saving
  const [error, setError] = useState(null);

  async function save(kind) {
    setSaving(kind);
    setError(null);
    try {
      await api(`/teach/courses/${slug}/quizzes`, {
        method: "POST",
        body: {
          kind,
          title: quiz.title,
          description: "Written with the AI quiz assistant.",
          published: false,
          questions: quiz.questions.map((q) => ({
            prompt: q.prompt,
            options: q.options.map((o) => o.text),
            correctIndex: q.options.findIndex((o) => o.id === q.correct),
            explanation: q.explanation,
          })),
        },
      });
      onSaved(kind);
      reload();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {quiz.title} <span className="font-normal text-slate-500 dark:text-slate-400">· {quiz.questions.length} questions</span>
        </p>
        {saved ? (
          <button
            type="button"
            onClick={() => setParams({ tab: saved === "test" ? "tests" : "quizzes" })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
          >
            <CheckCircle2 className="size-4" /> Saved as a draft {saved}. Open {saved === "test" ? "Tests" : "Quizzes"} to review
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => save("quiz")} disabled={Boolean(saving)}>
              <ListChecks className="size-3.5" /> {saving === "quiz" ? "Saving…" : "Save as draft quiz"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => save("test")} disabled={Boolean(saving)}>
              <FlaskConical className="size-3.5" /> {saving === "test" ? "Saving…" : "Save as draft test"}
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="px-4 pt-3">
          <ErrorNote error={error} />
        </div>
      )}
      <ol className="divide-y divide-slate-200 dark:divide-slate-800">
        {quiz.questions.map((q, i) => (
          <li key={q.id} className="px-4 py-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {i + 1}. {q.prompt}
            </p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {q.options.map((o) => {
                const right = o.id === q.correct;
                return (
                  <li
                    key={o.id}
                    className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm ${
                      right
                        ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {right && <CheckCircle2 className="size-3.5 shrink-0" />}
                    <span>{o.text}</span>
                  </li>
                );
              })}
            </ul>
            {q.explanation && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{q.explanation}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
