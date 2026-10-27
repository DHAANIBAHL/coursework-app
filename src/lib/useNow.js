import { useEffect, useState } from "react";

// The current time (ms), refreshed every `intervalMs`, so things like
// "Live now" and "upcoming vs past" update while the page is open.
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}
