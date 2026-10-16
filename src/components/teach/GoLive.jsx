import { useState } from "react";
import { Radio, Square, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { relativeTime } from "@/lib/format";
import { useNow } from "@/lib/useNow";

// "Start a live class now": creates a session that starts immediately, opens
// the meeting room, and shows students a Join button. While a class is live it
// shows Rejoin and End class instead.
export default function GoLive({ slug, sessions, reload }) {
  const now = useNow(15_000);
  const [title, setTitle] = useState("");
  const [useOwnLink, setUseOwnLink] = useState(false);
  const [ownLink, setOwnLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const live = sessions.find((s) => {
    const start = new Date(s.startsAt).getTime();
    return start <= now && now < start + s.durationMin * 60e3;
  });

  async function start() {
    setError("");
    if (useOwnLink && !/^https?:\/\//.test(ownLink.trim())) return setError("Paste the full meeting link, starting with https://");
    // Open the tab during the click, or the browser's pop-up blocker stops it.
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null; // the meeting site can't reach back into this page
    const meetingUrl = useOwnLink ? ownLink.trim() : `https://meet.jit.si/coursework-${slug}-${crypto.randomUUID().slice(0, 8)}`;
    setBusy(true);
    try {
      await api(`/teach/courses/${slug}/sessions`, {
        method: "POST",
        body: { title: title.trim() || "Live class", startsAt: new Date().toISOString(), durationMin: 60, meetingUrl },
      });
      if (tab) tab.location.href = meetingUrl;
      setTitle("");
      reload();
    } catch (err) {
      tab?.close();
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function end() {
    if (!window.confirm("End this live class? Students will no longer see it as live.")) return;
    setBusy(true);
    try {
      await api(`/teach/sessions/${live.id}/end`, { method: "POST" });
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (live) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-3 rounded-full bg-red-600" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">You're live: {live.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Started {relativeTime(live.startsAt)}. Students see a Join button on their dashboard and course page.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={live.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 hover:shadow-md"
            >
              <Video className="size-4" /> Rejoin room
            </a>
            <Button variant="outline" onClick={end} disabled={busy}>
              <Square className="size-3.5" /> End class
            </Button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 p-5">
      <div className="flex flex-wrap items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Radio className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Start a live class now</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Opens a video room and tells your students you're live. Uses a free Jitsi room unless you paste your own Zoom, Meet, or Teams link.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional), e.g. Flexbox Q&A"
              aria-label="Live class title"
              className="min-w-48 flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
            {useOwnLink && (
              <input
                value={ownLink}
                onChange={(e) => setOwnLink(e.target.value)}
                placeholder="https://zoom.us/j/…"
                aria-label="Your meeting link"
                className="min-w-48 flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            )}
            <Button onClick={start} disabled={busy} className="h-9 px-4">
              <Video className="size-4" /> {busy ? "Starting…" : "Go live"}
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setUseOwnLink((v) => !v)}
            className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {useOwnLink ? "Use a free Jitsi room instead" : "Use my own meeting link"}
          </button>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
