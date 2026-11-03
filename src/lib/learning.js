import { useState } from "react";
import { api, useApi } from "@/lib/api";

// A student's relationship with one course: whether they've joined, which
// lessons they've finished, and actions to change that. Used on the course page.
export function useEnrollment(slug) {
  const { data, error, loading, reload } = useApi(`/learn/courses/${slug}`);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  // Optimistic lesson state, so checkmarks flip instantly.
  const [overrides, setOverrides] = useState({});

  const completed = new Set(data?.completedLessons ?? []);
  for (const [index, done] of Object.entries(overrides)) {
    if (done) completed.add(Number(index));
    else completed.delete(Number(index));
  }

  async function run(fn) {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err);
    } finally {
      setBusy(false);
    }
  }

  const join = () =>
    run(async () => {
      await api(`/learn/courses/${slug}/enroll`, { method: "POST" });
      reload();
    });

  const leave = () =>
    run(async () => {
      await api(`/learn/courses/${slug}/enroll`, { method: "DELETE" });
      reload();
    });

  const setLessonDone = (index, done) => {
    setOverrides((o) => ({ ...o, [index]: done }));
    return run(async () => {
      try {
        await api(`/learn/courses/${slug}/lessons/${index}`, { method: done ? "PUT" : "DELETE" });
      } catch (err) {
        setOverrides((o) => ({ ...o, [index]: !done })); // undo the optimistic change
        throw err;
      }
    });
  };

  return {
    enrolled: data?.enrolled ?? false,
    teachers: data?.teachers ?? [],
    completed,
    loading,
    error: error ?? actionError,
    busy,
    join,
    leave,
    setLessonDone,
  };
}

// The completed lesson indexes that are real lessons of a course with
// `totalLessons`. Progress is stored by position in the live database, so if
// lessons were removed from a course, older progress could point past the end.
export function completedWithin(completed, totalLessons) {
  return new Set([...completed].filter((i) => i >= 0 && i < totalLessons));
}

// Share of the course completed, 0–100, for progress bars.
export function percentDone(completed, totalLessons) {
  return totalLessons > 0 ? (completedWithin(completed, totalLessons).size / totalLessons) * 100 : 0;
}

// Index of the first lesson not yet completed (or the last lesson if all are).
export function nextLessonIndex(totalLessons, completed) {
  for (let i = 0; i < totalLessons; i++) if (!completed.has(i)) return i;
  return Math.max(0, totalLessons - 1);
}
