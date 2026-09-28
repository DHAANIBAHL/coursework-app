import { useEffect, useState } from "react";

// The chosen theme is saved per browser. With nothing saved, the site follows
// the device's light/dark setting. index.html has a tiny inline script that
// applies the same rule before React loads, so the page never flashes the
// wrong theme. Keep the two in sync.
const THEME_KEY = "coursework-theme";
const darkQuery = "(prefers-color-scheme: dark)";

function savedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Use in any component: const { theme, toggleTheme } = useTheme();
export function useTheme() {
  const [theme, setTheme] = useState(() => savedTheme() ?? systemTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow device changes (e.g. automatic dark mode at night) until the
  // visitor picks a theme themselves.
  useEffect(() => {
    const media = window.matchMedia(darkQuery);
    function handleChange() {
      if (!savedTheme()) setTheme(systemTheme());
    }
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked (e.g. private mode): the switch still works for this visit.
    }
    setTheme(next);
  }

  return { theme, toggleTheme };
}
