import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FormError, emailPattern } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

// Messages go to the server (POST /api/contact); admins read them under Admin → Messages.
const topics = ["A question about a course", "A problem with a quiz", "My account", "Something else"];

const controlClass =
  "mt-1.5 w-full rounded-md border bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2";
const controlIdle = "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900";
const controlError = "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900";

export default function ContactPage() {
  const { user } = useAuth();
  const blankForm = { name: user?.name ?? "", email: user?.email ?? "", topic: topics[0], message: "" };

  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [sentTo, setSentTo] = useState(null);
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);

  // Returns a function that updates one field of the form.
  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.email.trim()) next.email = "Enter your email.";
    else if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Write at least 10 characters so we know how to help.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: { name: form.name.trim(), email: form.email.trim(), topic: form.topic, message: form.message.trim() },
      });
      setSentTo(form.email.trim());
      setForm(blankForm);
      setErrors({});
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="page-enter mx-auto max-w-xl px-6 py-12">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Contact us</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Questions about a course, a quiz that seems wrong, or trouble with your account? Tell us
          about it. For quick answers, check the{" "}
          <Link to="/help" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Help page
          </Link>{" "}
          first.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          {sentTo ? (
            <div role="status">
              <CircleCheck className="size-8 text-green-600 dark:text-green-400" />
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Message received</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Thanks for getting in touch. We'll reply to {sentTo}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setSentTo(null)}>
                  Send another message
                </Button>
                <Link to="/courses" className={buttonVariants()}>
                  Back to courses
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormError message={formError} />
              <Field id="name" label="Name" value={form.name} onChange={update("name")} error={errors.name} autoComplete="name" />
              <Field id="email" label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} autoComplete="email" />

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  What's it about?
                </label>
                <select
                  id="topic"
                  value={form.topic}
                  onChange={(e) => update("topic")(e.target.value)}
                  className={`${controlClass} ${controlIdle}`}
                >
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message")(e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  placeholder="Include the course and lesson or quiz name if it's about specific content."
                  className={`${controlClass} ${errors.message ? controlError : controlIdle}`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                )}
              </div>

              <Button type="submit" className="h-10 w-full" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
