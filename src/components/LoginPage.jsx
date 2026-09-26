import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthShell, Field, FormError, emailPattern } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  // Set when the email isn't registered, so we can offer to create an account.
  const [noAccountFor, setNoAccountFor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip this page.
  if (loading) return null;
  if (user && !submitting) return <Navigate to={redirectTo} replace />;

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter your email.";
    else if (!emailPattern.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setNoAccountFor("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.code === "NO_ACCOUNT") setNoAccountFor(email.trim());
      else setFormError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back. Pick up where you left off."
      footer={
        <>
          New to Coursework?{" "}
          <Link to="/signup" state={{ from: redirectTo }} className="font-medium text-blue-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormError message={formError} />
        {noAccountFor && (
          <div role="alert" className="rounded-md border border-blue-200 bg-blue-50 px-3 py-3 text-sm text-slate-700">
            <p>
              There's no account for <span className="font-medium text-slate-900">{noAccountFor}</span>. Check the
              spelling, or create a new account.
            </p>
            <Link
              to="/signup"
              state={{ from: redirectTo, email: noAccountFor }}
              className="mt-2 inline-block font-medium text-blue-600 hover:underline"
            >
              Create an account with this email
            </Link>
          </div>
        )}
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" className="h-10 w-full" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
