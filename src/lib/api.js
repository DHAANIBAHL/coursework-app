import { useCallback, useEffect, useState } from "react";

// Talks to the Express server in the coursework-server folder.
// Vite forwards every /api request to it (see vite.config.js).
// Throws an Error with the server's message, plus `code` (e.g. "NO_ACCOUNT")
// and `status` so pages can react to specific cases.
export async function api(path, { method = "GET", body } = {}) {
  const isForm = body instanceof FormData; // file uploads
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body && !isForm ? { "Content-Type": "application/json" } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Make sure the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Can't reach the server. Make sure the backend is running.");
    error.code = data.code;
    error.status = response.status;
    throw error;
  }
  return data;
}

// Loads `path` when the component mounts (and whenever `path` changes).
// Returns { data, error, loading, reload }; call reload() after a change.
export function useApi(path) {
  const [version, setVersion] = useState(0);
  // The latest finished request, tagged with which path/version it was for.
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const key = `${path}#${version}`;

  useEffect(() => {
    let cancelled = false;
    api(path)
      .then((data) => !cancelled && setResult({ key, data, error: null }))
      .catch((error) => !cancelled && setResult({ key, data: null, error }));
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  // Keep showing the previous data while a reload is in flight.
  const loading = result.key !== key;
  return { data: result.data, error: loading ? null : result.error, loading, reload };
}
