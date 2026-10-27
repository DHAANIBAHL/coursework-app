import { useRef, useState } from "react";
import { Download, FileText, Link2, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/AuthForm";
import { EmptyState, ErrorNote, Section } from "@/components/panel/Panel";
import { FileInput, TextArea, TextInput } from "@/components/panel/Form";
import { api, uploadWithProgress } from "@/lib/api";
import { fileSize, formatDate } from "@/lib/format";

const kindIcons = { file: FileText, video: Video, link: Link2 };

// Upload documents and videos, or share links, for this course's students.
export default function MaterialsTab({ slug, data, reload }) {
  const [mode, setMode] = useState("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(null);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState(null);
  const fileRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!title.trim()) return setFormError("Give the material a title.");
    if (mode === "file" && !file) return setFormError("Choose a file to upload.");
    if (mode === "link" && !url.trim()) return setFormError("Paste the link.");

    const form = new FormData();
    form.append("title", title.trim());
    form.append("description", description.trim());
    if (mode === "file") form.append("file", file);
    else form.append("url", url.trim());

    setProgress(0);
    try {
      await uploadWithProgress(`/teach/courses/${slug}/materials`, form, setProgress);
      setTitle("");
      setDescription("");
      setFile(null);
      setUrl("");
      if (fileRef.current) fileRef.current.value = "";
      reload();
    } catch (err) {
      setFormError(err.code === "FILE_TOO_BIG" ? "That file is over the 500 MB limit." : err.message);
    } finally {
      setProgress(null);
    }
  }

  async function remove(m) {
    if (!window.confirm(`Delete "${m.title}"? Students will no longer see it.`)) return;
    try {
      await api(`/teach/materials/${m.id}`, { method: "DELETE" });
      setActionError(null);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <div className="space-y-6">
      <Section title="Add material">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          <FormError message={formError} />
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-1">
            {[
              ["file", "Upload a file or video"],
              ["link", "Share a link"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  mode === id
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput id="m-title" label="Title" value={title} onChange={setTitle} placeholder="e.g. Week 1 slides" />
            {mode === "file" ? (
              <FileInput
                id="m-file"
                label="File"
                onChange={setFile}
                inputRef={fileRef}
                hint="Documents, slides, images, or videos, up to 500 MB. Videos play right on the course page."
              />
            ) : (
              <TextInput id="m-url" label="Link" type="url" value={url} onChange={setUrl} placeholder="https://" />
            )}
          </div>
          <TextArea id="m-desc" label="Description (optional)" rows={2} value={description} onChange={setDescription} />
          {progress !== null && (
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-blue-600 dark:bg-blue-400 transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Uploading… {Math.round(progress * 100)}%</p>
            </div>
          )}
          <Button type="submit" disabled={progress !== null}>
            <Upload className="size-4" /> {progress !== null ? "Uploading…" : "Add material"}
          </Button>
        </form>
      </Section>

      <ErrorNote error={actionError} />

      <Section title={`Materials (${data.materials.length})`}>
        {data.materials.length === 0 ? (
          <EmptyState>Nothing shared yet.</EmptyState>
        ) : (
          <ul className="rows-hover divide-y divide-slate-200 dark:divide-slate-800">
            {data.materials.map((m) => {
              const Icon = kindIcons[m.kind];
              return (
                <li key={m.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <Icon className="mt-0.5 size-5 shrink-0 text-slate-400 dark:text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{m.title}</p>
                      {m.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{m.description}</p>}
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {m.kind === "link" ? m.url : `${m.fileName} · ${fileSize(m.sizeBytes)}`} · added {formatDate(m.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={m.kind === "link" ? m.url : `${m.url}?download`}
                        target={m.kind === "link" ? "_blank" : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {m.kind === "link" ? <Link2 className="size-3.5" /> : <Download className="size-3.5" />}
                        {m.kind === "link" ? "Open" : "Download"}
                      </a>
                      <Button variant="destructive" size="sm" onClick={() => remove(m)} aria-label={`Delete ${m.title}`}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {m.kind === "video" && (
                    <video src={m.url} controls preload="metadata" className="mt-3 aspect-video w-full max-w-xl rounded-md bg-black object-contain" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
