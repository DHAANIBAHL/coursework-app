import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import { buttonVariants } from "@/components/ui/button";

// Answers describe how the app works today. Update them when that changes
// (saved quiz scores, password reset).
const sections = [
  {
    title: "Getting started",
    questions: [
      {
        q: "Is Coursework free?",
        a: "Yes. Every course, lesson, and quiz is free. You only need an account to open them.",
      },
      {
        q: "Which course should I start with?",
        a: "If you're new to building websites, start with Introduction to Web Design, then JavaScript Essentials. The other courses stand on their own, so pick whichever topic you need.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. Lessons and quizzes run in your browser. To try the code examples yourself you'll want a code editor, and for the Node.js, Python, and SQL courses the matching tool installed on your computer.",
      },
    ],
  },
  {
    title: "Courses and quizzes",
    questions: [
      {
        q: "How are the courses organized?",
        a: "Each course is a list of short lessons meant to be read in order. Open a lesson to see an explanation, a code example, and a practical takeaway.",
      },
      {
        q: "How do the quizzes work?",
        a: "Every course has several quizzes, one for each section of lessons. Answer every question, then check your answers to see your score and an explanation for each question. After that you can retake the quiz or move on to the next one.",
      },
      {
        q: "Is my quiz score saved?",
        a: "Not yet. Your score shows when you finish a quiz but isn't kept after you leave the page. Saved progress is planned for the My learning page.",
      },
      {
        q: "Can I retake a quiz?",
        a: "Yes, as many times as you like. Use Retake this quiz on the results screen to clear your answers and start again.",
      },
    ],
  },
  {
    title: "Your account",
    questions: [
      {
        q: "Can I log in on another device?",
        a: "Yes. Your account is saved on our server, so log in with the same email and password on any browser or device.",
      },
      {
        q: "It says there's no account for my email.",
        a: "Check the email for typos. If it's right, you haven't signed up with it yet, so use Create an account on the login page.",
      },
      {
        q: "How long do I stay logged in?",
        a: "Seven days on each browser, unless you log out first. After that you'll be asked to log in again.",
      },
      {
        q: "I forgot my password. What can I do?",
        a: "There's no password reset yet. Contact us and we'll help you get back in.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-semibold text-slate-900">Help</h1>
        <p className="mt-3 text-lg text-slate-600">
          Answers to common questions about courses, quizzes, and your account.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-12">
            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
            <div className="mt-4 space-y-3">
              {section.questions.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-lg border border-slate-200 open:border-slate-300 open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{item.q}</span>
                    <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="border-t border-slate-200 px-4 pb-4 pt-3 leading-relaxed text-slate-700">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 rounded-lg bg-blue-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Still stuck?</h2>
          <p className="mt-1 text-slate-600">Send us a message and tell us what's going on.</p>
          <Link to="/contact" className={`${buttonVariants()} mt-4`}>
            Contact us
          </Link>
        </div>
      </main>
    </div>
  );
}
