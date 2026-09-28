import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SearchDialog from "@/components/SearchDialog";
import { useTheme } from "@/lib/theme";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  UserPlus,
  X,
} from "lucide-react";

// Shared look for the text links in the header.
const linkBase =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600";
const linkIdle = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";
const linkActive = "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800";

const menuItem =
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";

// Sun in dark mode (switch to light), moon in light mode (switch to dark).
function ThemeButton({ theme, onToggle, className = "" }) {
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // First letters of the user's name, e.g. "Asha Rao" -> "AR"
  const initials = user
    ? user.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")
    : "";

  async function handleLogout() {
    await logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/login");
  }
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef(null);

  // "Courses" counts as active on the catalog and on any course page.
  const onCourses = pathname === "/" || pathname.startsWith("/course");

  // Close both menus whenever the page changes.
  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Ctrl+K (or Cmd+K on a Mac) opens search from anywhere.
  useEffect(() => {
    if (!user) return;
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [user]);

  // Close the account menu when clicking outside it or pressing Escape.
  useEffect(() => {
    if (!accountOpen) return;
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link to="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Coursework
        </Link>

        {/* Left-side nav (desktop) */}
        {user && (
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={`${linkBase} ${onCourses ? linkActive : linkIdle}`}>
            Courses
          </Link>
          <Link
            to="/my-learning"
            className={`${linkBase} ${pathname === "/my-learning" ? linkActive : linkIdle}`}
          >
            My learning
          </Link>
        </nav>
        )}

        {/* Right-side actions (desktop) */}
        <div className="ml-auto hidden items-center gap-1 md:flex">
          {user && (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="mr-2 flex w-56 items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Search className="size-4" />
              <span className="flex-1 text-left">Search</span>
              <kbd className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-1.5 font-sans text-xs text-slate-400 dark:text-slate-500">Ctrl K</kbd>
            </button>
          )}
          <Link to="/help" className={`${linkBase} ${linkIdle} inline-flex items-center gap-2`}>
            <CircleHelp className="size-4" />
            Help
          </Link>
          <Link to="/contact" className={`${linkBase} ${linkIdle} inline-flex items-center gap-2`}>
            <Mail className="size-4" />
            Contact us
          </Link>

          <ThemeButton theme={theme} onToggle={toggleTheme} />

          <div className="relative ml-2" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
              className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-700 text-xs font-semibold text-white">
                {user ? initials : <User className="size-4" />}
              </span>
              <ChevronDown
                className={`size-4 text-slate-500 dark:text-slate-400 transition-transform ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>

            {accountOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-lg"
              >
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                    <Link to="/my-learning" role="menuitem" className={menuItem}>
                      <BookOpen className="size-4" /> My learning
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout} className={menuItem}>
                      <LogOut className="size-4" /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">You're browsing as a guest</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Log in to track your progress.</p>
                    </div>
                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                    <Link to="/login" role="menuitem" className={menuItem}>
                      <LogIn className="size-4" /> Log in
                    </Link>
                    <Link to="/signup" role="menuitem" className={menuItem}>
                      <UserPlus className="size-4" /> Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search and menu buttons (mobile) */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeButton theme={theme} onToggle={toggleTheme} />
          {user && (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="size-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Dropdown panel (mobile) */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 dark:border-slate-800 px-6 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {user && (
              <>
                <Link to="/" className={`${linkBase} ${onCourses ? linkActive : linkIdle}`}>
                  Courses
                </Link>
                <Link to="/my-learning" className={`${linkBase} ${linkIdle}`}>My learning</Link>
              </>
            )}
            <Link to="/help" className={`${linkBase} ${linkIdle}`}>Help</Link>
            <Link to="/contact" className={`${linkBase} ${linkIdle}`}>Contact us</Link>
            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
            {user ? (
              <>
                <p className="px-3 py-1 text-sm text-slate-500 dark:text-slate-400">Signed in as {user.name}</p>
                <button type="button" onClick={handleLogout} className={`${linkBase} ${linkIdle} text-left`}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${linkBase} ${linkIdle}`}>Log in</Link>
                <Link to="/signup" className={`${linkBase} ${linkIdle}`}>Create account</Link>
              </>
            )}
          </div>
        </nav>
      )}
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
