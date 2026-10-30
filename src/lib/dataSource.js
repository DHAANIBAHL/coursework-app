import { useSyncExternalStore } from "react";

// Development-only record of where course data comes from, shown by
// DataSourceBadge. Nothing is recorded in production builds.

// Set by any module holding hardcoded course data (the old src/data/courses.js
// did; nothing does now). Every page is bundled together, so this means some
// code in the app still imports hardcoded data.
export const hardcodedDataLoaded = () => Boolean(globalThis.__courseworkHardcodedData);

let requests = []; // { page, label }, newest last
const listeners = new Set();

// Notes a catalog request made while on the current page (window.location
// already points at the page being shown when its data loads).
export function recordCatalogRequest(label) {
  if (!import.meta.env.DEV) return;
  requests = [...requests.slice(-49), { page: window.location.pathname, label }];
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The distinct catalog requests made on `page`, oldest first. (In development
// React runs effects twice, so most requests really are made twice.)
export function useCatalogRequests(page) {
  const all = useSyncExternalStore(subscribe, () => requests);
  return [...new Set(all.filter((r) => r.page === page).map((r) => r.label))];
}
