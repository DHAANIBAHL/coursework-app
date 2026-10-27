import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileText,
  FlaskConical,
  ListChecks,
  Megaphone,
  PlayCircle,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { ErrorNote, Loading, PageHeading } from "@/components/panel/Panel";
import SectionMenu from "@/components/panel/SectionMenu";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";
import GoLive from "@/components/teach/GoLive";
import StudentsTab from "@/components/teach/StudentsTab";
import MaterialsTab from "@/components/teach/MaterialsTab";
import AnnouncementsTab from "@/components/teach/AnnouncementsTab";
import AiAssistantTab from "@/components/teach/AiAssistantTab";
import AssignmentsTab from "@/components/teach/AssignmentsTab";
import QuizzesTab from "@/components/teach/QuizzesTab";
import SessionsTab from "@/components/teach/SessionsTab";
import { useNow } from "@/lib/useNow";

// The sections of a course, in the order teachers use them. `render` draws the
// section; `count` and `hint` feed the overview cards; `group` sorts the section menu.
const sections = [
  {
    id: "live",
    group: "Teach",
    label: "Live class",
    icon: Radio,
    hint: "Go live now or schedule a class",
    render: (p) => <SessionsTab {...p} />,
    count: (d, now) => d.sessions.filter((s) => new Date(s.startsAt).getTime() + s.durationMin * 60e3 >= now).length,
    countLabel: "upcoming",
  },
  {
    id: "announcements",
    group: "Teach",
    label: "Announcements",
    icon: Megaphone,
    hint: "Post now, schedule for later, or save drafts",
    render: (p) => <AnnouncementsTab {...p} />,
    count: (d) => d.announcements.filter((a) => (a.status ?? "posted") === "posted").length,
    countLabel: "posted",
  },
  {
    id: "quizzes",
    group: "Assess",
    label: "Quizzes",
    icon: ListChecks,
    hint: "Quick practice checks",
    render: (p) => <QuizzesTab {...p} kind="quiz" />,
    count: (d) => d.quizzes.filter((q) => (q.kind ?? "quiz") === "quiz").length,
    countLabel: "quizzes",
  },
  {
    id: "tests",
    group: "Assess",
    label: "Tests",
    icon: FlaskConical,
    hint: "Timed assessments with limited attempts",
    render: (p) => <QuizzesTab {...p} kind="test" />,
    count: (d) => d.quizzes.filter((q) => q.kind === "test").length,
    countLabel: "tests",
  },
  {
    id: "assistant",
    group: "Assess",
    label: "AI quiz assistant",
    icon: Sparkles,
    hint: "Describe a topic, get questions to save as a quiz or test",
    render: (p) => <AiAssistantTab {...p} />,
    count: () => null, // nothing to count; the card shows "New" instead
    countLabel: "",
  },
  {
    id: "assignments",
    group: "Assess",
    label: "Assignments",
    icon: ClipboardCheck,
    hint: "Set work, collect hand-ins, grade",
    render: (p) => <AssignmentsTab {...p} />,
    count: (d) => d.assignments.reduce((n, a) => n + a.toGrade, 0),
    countLabel: "to grade",
  },
  {
    id: "videos",
    group: "Content",
    label: "Videos",
    icon: PlayCircle,
    hint: "Pre-recorded lectures",
    render: (p) => <MaterialsTab {...p} kind="video" />,
    count: (d) => d.materials.filter((m) => m.kind === "video").length,
    countLabel: "videos",
  },
  {
    id: "materials",
    group: "Content",
    label: "Learning materials",
    icon: FileText,
    hint: "Documents, slides, and links",
    render: (p) => <MaterialsTab {...p} kind="material" />,
    count: (d) => d.materials.filter((m) => m.kind !== "video").length,
    countLabel: "shared",
  },
  {
    id: "students",
    group: "People",
    label: "Students",
    icon: Users,
    hint: "Progress and results",
    render: (p) => <StudentsTab {...p} />,
    count: (d) => d.students.length,
    countLabel: "enrolled",
  },
];

// Old links used ?tab=sessions for live classes.
const aliases = { sessions: "live" };

// One course from the teacher's side. The active section lives in the URL
// (?tab=assignments) so links from the dashboard can open the right one.
export default function TeachCourse() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const course = getCourse(slug);
  const { data, error, loading, reload } = useApi(`/teach/courses/${slug}`);
  const requested = aliases[params.get("tab")] ?? params.get("tab");
  const active = sections.find((s) => s.id === requested) ?? null; // null = overview
  const open = (id) => setParams(id ? { tab: id } : {});

  return (
    <>
      <PageHeading
        title={course?.title ?? slug}
        description={data ? `${data.students.length} student${data.students.length === 1 ? "" : "s"} enrolled` : " "}
        action={
          course && (
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/course/${slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Course lessons <ExternalLink className="size-3.5" />
              </Link>
              <Link
                to={`/teach/courses/${slug}/student-view`}
                className="inline-flex items-center gap-1.5 rounded-md border border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 transition-colors hover:bg-violet-100 dark:hover:bg-violet-950"
              >
                <Eye className="size-4" /> Student view
              </Link>
            </div>
          )
        }
      />

      <SectionMenu sections={sections} active={active?.id ?? null} onOpen={open} />

      <ErrorNote error={error} onRetry={reload} />
      {loading && !data ? (
        <Loading />
      ) : (
        data &&
        (active ? (
          <div key={active.id} className="page-enter">
            {active.render({ slug, course, data, reload })}
          </div>
        ) : (
          <Overview slug={slug} data={data} reload={reload} onOpen={open} />
        ))
      )}
    </>
  );
}

// The course home for teachers: go live, then a card for every section.
function Overview({ slug, data, reload, onOpen }) {
  const now = useNow();
  return (
    <div className="page-enter space-y-6">
      <GoLive slug={slug} sessions={data.sessions} reload={reload} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const n = s.count(data, now);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpen(s.id)}
              className="lift group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-left hover:border-blue-200 dark:hover:border-blue-900 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
                  <s.icon className="size-5" />
                </span>
                <span className="text-right">
                  {n === null ? (
                    <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">New</span>
                  ) : (
                    <>
                      <span className="block text-2xl font-semibold text-slate-900 dark:text-slate-100">{n}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{s.countLabel}</span>
                    </>
                  )}
                </span>
              </div>
              <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {s.label}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
