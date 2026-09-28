import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthShell, Field, FormError, emailPattern } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({
    name: "",
    // Filled in when the login page sends someone here after "no account found".
    email: location.state?.email ?? "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user && !submitting) return <Navigate to={redirectTo} replace />;

  // Returns a function that updates one field of the form.
  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.email.trim()) next.email = "Enter your email.";
    else if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (!form.confirm) next.confirm = "Re-enter your password.";
    else if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await signup(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free access to every course and quiz."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={{ from: redirectTo }} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormError message={formError} />
        <Field id="name" label="Full name" value={form.name} onChange={update("name")} error={errors.name} autoComplete="name" />
        <Field id="email" label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} autoComplete="email" />
        <Field
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
        />
        <Field
          id="confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" className="h-10 w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
