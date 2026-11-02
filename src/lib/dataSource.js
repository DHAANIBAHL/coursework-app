import { useSyncExternalStore } from "react";

// A record of where each page's course data came from, shown by
// DataSourceBadge (in development, and to admins). It is a short in-memory
// list, so recording costs nothing noticeable for other users.

// Set by any module holding hardcoded course data (the old src/data/courses.js
// did; nothing does now). Every page is bundled together, so this means some
// code in the app still imports hardcoded data.
export const hardcodedDataLoaded = () => Boolean(globalThis.__courseworkHardcodedData);

let requests = []; // { page, label, at }, newest last
const listeners = new Set();

// Notes that catalog data arrived at `at` while on the current page
// (window.location already points at the page being shown when its data loads).
export function recordCatalogRequest(label, at = new Date()) {
  requests = [...requests.slice(-49), { page: window.location.pathname, label, at }];
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The distinct catalog requests made on `page`, oldest first, each with the
// time its data arrived (the latest, since in development React runs effects
// twice and most requests really are made twice).
export function useCatalogRequests(page) {
  const all = useSyncExternalStore(subscribe, () => requests);
  const byLabel = new Map();
  for (const r of all) if (r.page === page) byLabel.set(r.label, r.at);
  return [...byLabel].map(([label, at]) => ({ label, at }));
}
