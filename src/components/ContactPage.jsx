import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, emailPattern } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

// TEMPORARY STORAGE: messages are saved in this browser's localStorage.
// When the backend is ready, send them to the server with fetch() instead.
const MESSAGES_KEY = "coursework-messages";

const topics = ["A question about a course", "A problem with a quiz", "My account", "Something else"];

const controlClass =
  "mt-1.5 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2";
const controlIdle = "border-slate-300 focus:border-blue-500 focus:ring-blue-100";
const controlError = "border-red-400 focus:border-red-500 focus:ring-red-100";

function saveMessage(message) {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  } catch {
    saved = [];
  }
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...saved, message]));
}

export default function ContactPage() {
  const { user } = useAuth();
  const blankForm = { name: user?.name ?? "", email: user?.email ?? "", topic: topics[0], message: "" };

  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [sentTo, setSentTo] = useState(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveMessage({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      topic: form.topic,
      message: form.message.trim(),
      sentAt: new Date().toISOString(),
    });
    setSentTo(form.email.trim());
    setForm(blankForm);
    setErrors({});
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-xl px-6 py-12">
        <h1 className="text-4xl font-semibold text-slate-900">Contact us</h1>
        <p className="mt-3 text-lg text-slate-600">
          Questions about a course, a quiz that seems wrong, or trouble with your account? Tell us
          about it. For quick answers, check the{" "}
          <Link to="/help" className="font-medium text-blue-600 hover:underline">
            Help page
          </Link>{" "}
          first.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          {sentTo ? (
            <div role="status">
              <CircleCheck className="size-8 text-green-600" />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Message received</h2>
              <p className="mt-1 text-slate-600">
                Thanks for getting in touch. We'll reply to {sentTo}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setSentTo(null)}>
                  Send another message
                </Button>
                <Link to="/" className={buttonVariants()}>
                  Back to courses
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field id="name" label="Name" value={form.name} onChange={update("name")} error={errors.name} autoComplete="name" />
              <Field id="email" label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} autoComplete="email" />

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-800">
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
                <label htmlFor="message" className="block text-sm font-medium text-slate-800">
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
                  <p id="message-error" className="mt-1.5 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <Button type="submit" className="h-10 w-full">
                Send message
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
