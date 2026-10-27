import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { homePathFor } from "@/lib/roles";
import CatalogPage from "@/components/CatalogPage";
import ContactPage from "@/components/ContactPage";
import HelpPage from "@/components/HelpPage";
import LandingPage from "@/components/LandingPage";
import CoursePage from "@/components/CoursePage";
import LoginPage from "@/components/LoginPage";
import QuizPage from "@/components/QuizPage";
import SignupPage from "@/components/SignupPage";

// Jump back to the top of the page whenever the URL changes.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Links to a spot on the page (#lesson-5) scroll there themselves.
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Sends logged-out visitors to the login page, remembering where they
// were headed so they land there after logging in. With `roles`, only those
// roles get in; anyone else sees a "no access" page.
function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the server to say whether we're logged in before deciding.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <NoAccess home={homePathFor(user.role)} />;
  }
  return children;
}

function NoAccess({ home }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">You don't have access to this page</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Your account can't open this area. If you think it should, ask an admin to change your role.
      </p>
      <Link to={home} className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
        Go to your home page
      </Link>
    </main>
  );
}

// The homepage: the public landing page for guests; logged-in users go to
// their role's home (see src/lib/roles.js).
function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;
  return <LandingPage />;
}

function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">This page doesn't exist yet.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
        Back to courses
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/courses"
          element={
            <RequireAuth>
              <CatalogPage />
            </RequireAuth>
          }
        />
        <Route
          path="/course/:slug"
          element={
            <RequireAuth>
              <CoursePage />
            </RequireAuth>
          }
        />
        <Route
          path="/course/:slug/quiz/:quizId"
          element={
            <RequireAuth>
              <QuizPage />
            </RequireAuth>
          }
        />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
