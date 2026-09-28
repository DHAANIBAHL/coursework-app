import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, ListChecks, Search, X } from "lucide-react";
import { search } from "@/lib/search";

const typeIcons = { course: BookOpen, lesson: FileText, quiz: ListChecks };
const typeLabels = { course: "Course", lesson: "Lesson", quiz: "Quiz" };

// Full-screen search over every course, lesson, and quiz.
// Render it only while open, so it starts empty each time. It is drawn
// straight into <body> because the header's blur effect would otherwise
// trap the full-screen overlay inside the header.
export default function SearchDialog({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = search(query);

  // Focus the box on open, and stop the page behind from scrolling.
  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keep the highlighted result visible when moving with the arrow keys.
  useEffect(() => {
    document.getElementById(`search-result-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function updateQuery(value) {
    setQuery(value);
    setActive(0);
  }

  function open(result) {
    onClose();
    navigate(result.to);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      open(results[active]);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 dark:bg-black/60 px-4 pt-[10vh]"
      onMouseDown={(e) => {
        // Clicking the dark backdrop (not the panel) closes the search.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search courses"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4">
          <Search className="size-5 shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, lessons, and quizzes"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="size-4" />
          </button>
        </div>

        {query.trim() === "" ? (
          <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
            Try "flexbox", "closures", "joins", or "gradient descent".
          </p>
        ) : results.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
            No matches for "{query.trim()}". Try a shorter or different word.
          </p>
        ) : (
          <ul id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((result, index) => {
              const Icon = typeIcons[result.type];
              return (
                <li
                  key={result.to}
                  id={`search-result-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  onClick={() => open(result)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 ${
                    index === active ? "bg-blue-50 dark:bg-blue-950/50" : ""
                  }`}
                >
                  <Icon className={`size-4 shrink-0 ${index === active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{result.title}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{result.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{typeLabels[result.type]}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="hidden items-center gap-4 border-t border-slate-200 dark:border-slate-800 px-4 py-2 text-xs text-slate-400 dark:text-slate-500 sm:flex">
          <span>↑ ↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
