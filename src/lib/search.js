import { courses } from "@/data/courses";

// One flat list of everything searchable, built once from the course data.
// Each entry: { type, title, subtitle, to, text } where `text` is the
// extra content matched with lower priority (descriptions, lesson bodies).
const entries = courses.flatMap((course) => [
  {
    type: "course",
    title: course.title,
    subtitle: `${course.tag} · ${course.lessons.length} lessons`,
    to: `/course/${course.slug}`,
    text: course.description,
  },
  ...course.lessons.map((lesson, index) => ({
    type: "lesson",
    title: lesson.title,
    subtitle: `${course.title} · Lesson ${index + 1}`,
    to: `/course/${course.slug}#lesson-${index + 1}`,
    text: `${lesson.body} ${lesson.after ?? ""}`,
  })),
  ...course.quizzes.map((quiz) => ({
    type: "quiz",
    title: quiz.title,
    subtitle: `${course.title} · Quiz`,
    to: `/course/${course.slug}/quiz/${quiz.id}`,
    text: quiz.description,
  })),
]);

// Courses first, then lessons, then quizzes when scores tie.
const typeOrder = { course: 0, lesson: 1, quiz: 2 };

// Returns the best matches for a query. Every word in the query must appear
// somewhere in the entry; matches in the title rank above matches in the text.
export function search(query, limit = 20) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const results = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const subtitle = entry.subtitle.toLowerCase();
    const text = entry.text.toLowerCase();

    let score = 0;
    let allFound = true;
    for (const word of words) {
      if (title.startsWith(word)) score += 6;
      else if (title.includes(word)) score += 4;
      else if (subtitle.includes(word)) score += 2;
      else if (text.includes(word)) score += 1;
      else {
        allFound = false;
        break;
      }
    }
    if (allFound) results.push({ ...entry, score });
  }

  return results
    .sort((a, b) => b.score - a.score || typeOrder[a.type] - typeOrder[b.type])
    .slice(0, limit);
}
