import { Link, useParams, useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { ErrorNote, Loading, PageHeading } from "@/components/panel/Panel";
import { getCourse } from "@/data/courses";
import { useApi } from "@/lib/api";
import StudentsTab from "@/components/teach/StudentsTab";
import MaterialsTab from "@/components/teach/MaterialsTab";
import AnnouncementsTab from "@/components/teach/AnnouncementsTab";
import AssignmentsTab from "@/components/teach/AssignmentsTab";
import QuizzesTab from "@/components/teach/QuizzesTab";
import SessionsTab from "@/components/teach/SessionsTab";

const tabs = [
  { id: "students", label: "Students", Component: StudentsTab },
  { id: "materials", label: "Materials", Component: MaterialsTab },
  { id: "announcements", label: "Announcements", Component: AnnouncementsTab },
  { id: "assignments", label: "Assignments", Component: AssignmentsTab },
  { id: "quizzes", label: "Quizzes", Component: QuizzesTab },
  { id: "sessions", label: "Live classes", Component: SessionsTab },
];

// One course from the teacher's side. The active tab lives in the URL
// (?tab=assignments) so links from the dashboard can open the right one.
export default function TeachCourse() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const course = getCourse(slug);
  const { data, error, loading, reload } = useApi(`/teach/courses/${slug}`);
  const active = tabs.find((t) => t.id === params.get("tab")) ?? tabs[0];

  return (
    <>
      <PageHeading
        title={course?.title ?? slug}
        description={data ? `${data.students.length} student${data.students.length === 1 ? "" : "s"} enrolled` : " "}
        action={
          course && (
            <Link to={`/course/${slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              View as a student <ExternalLink className="size-3.5" />
            </Link>
          )
        }
      />

      <div role="tablist" className="-mx-6 mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-6 md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active.id}
            onClick={() => setParams({ tab: t.id })}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              t.id === active.id
                ? "border-blue-600 dark:border-blue-400 text-slate-900 dark:text-slate-100"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ErrorNote error={error} onRetry={reload} />
      {loading && !data ? <Loading /> : data && <active.Component slug={slug} course={course} data={data} reload={reload} />}
    </>
  );
}
