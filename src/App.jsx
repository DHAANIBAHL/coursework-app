import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import CatalogPage from "@/components/CatalogPage";
import ContactPage from "@/components/ContactPage";
import HelpPage from "@/components/HelpPage";
import CoursePage from "@/components/CoursePage";
import LoginPage from "@/components/LoginPage";
import QuizPage from "@/components/QuizPage";
import SignupPage from "@/components/SignupPage";

// Jump back to the top of the page whenever the URL changes.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Sends logged-out visitors to the login page, remembering where they
// were headed so they land there after logging in.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the server to say whether we're logged in before deciding.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">This page doesn't exist yet.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
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
        <Route
          path="/"
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
