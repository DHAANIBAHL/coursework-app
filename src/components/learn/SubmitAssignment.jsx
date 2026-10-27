import { useRef, useState } from "react";
import { Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { Section } from "@/components/panel/Panel";
import { FileInput, TextArea } from "@/components/panel/Form";
import DeadlineStatus from "@/components/learn/DeadlineStatus";
import { uploadWithProgress } from "@/lib/api";
import { formatDate, relativeTime } from "@/lib/format";
import { useNow } from "@/lib/useNow";

// One assignment: instructions, my submission (text and/or file), and the
// grade once the teacher has marked it. Resubmitting is allowed until graded.
export default function SubmitAssignment({ assignment: a, onSubmitted, preview = false }) {
  const sub = a.mySubmission;
  const graded = sub && sub.grade !== null;
  const now = useNow();
  const [editing, setEditing] = useState(!sub);
  const [text, setText] = useState(sub?.textAnswer ?? "");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [formError, setFormError] = useState("");
  const fileRef = useRef(null);

  const overdue = new Date(a.dueAt).getTime() < now;
  const status = graded ? "graded" : sub ? "submitted" : overdue ? "overdue" : "todo";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() && !file && !sub?.file) return setFormError("Write an answer or attach a file.");
    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);
    setFormError("");
    setProgress(0);
    try {
      await uploadWithProgress(`/learn/assignments/${a.id}/submission`, form, setProgress);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setEditing(false);
      onSubmitted();
    } catch (err) {
      setFormError(err.code === "FILE_TOO_BIG" ? "That file is over the 25 MB limit." : err.message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <Section>
      <div id={`assignment-${a.id}`} className="scroll-mt-24 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Due {formatDate(a.dueAt, true)} ({relativeTime(a.dueAt)}) · {a.maxPoints} points
            </p>
          </div>
          <DeadlineStatus status={status} />
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{a.instructions}</p>

        {graded && (
          <div className="mt-4 rounded-md bg-green-50 dark:bg-green-950/50 p-4">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Grade: {sub.grade}/{a.maxPoints}
            </p>
            {sub.feedback && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{sub.feedback}</p>}
          </div>
        )}

        {sub && !editing && (
          <div className="mt-4 rounded-md border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Handed in {formatDate(sub.submittedAt, true)}
              {new Date(sub.submittedAt) > new Date(a.dueAt) && <span className="ml-1 font-medium text-red-600 dark:text-red-400">(late)</span>}
            </p>
            {sub.textAnswer && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{sub.textAnswer}</p>}
            {sub.file && (
              <a href={`${sub.file.url}?download`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                <Download className="size-3.5" /> {sub.file.name}
              </a>
            )}
            {!graded && (
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Change my submission
                </Button>
              </div>
            )}
          </div>
        )}

        {preview && (
          <p className="mt-4 rounded-md border border-dashed border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-600 dark:text-slate-400">
            Students write their answer and attach a file here. Handing in is turned off in the student view.
          </p>
        )}

        {editing && !graded && !preview && (
          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            <FormError message={formError} />
            {overdue && !sub && (
              <p className="text-sm text-red-600 dark:text-red-400">This is past its due date. You can still hand it in, but it will be marked late.</p>
            )}
            <TextArea id={`answer-${a.id}`} label="Your answer" rows={5} value={text} onChange={setText} />
            <FileInput
              id={`file-${a.id}`}
              label={sub?.file ? `Replace your file (${sub.file.name})` : "Attach a file (optional)"}
              hint="Up to 25 MB."
              onChange={setFile}
              inputRef={fileRef}
            />
            {progress !== null && (
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: `${progress * 100}%` }} />
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={progress !== null}>
                <Send className="size-4" /> {progress !== null ? "Handing in…" : sub ? "Update submission" : "Hand in"}
              </Button>
              {sub && (
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}
