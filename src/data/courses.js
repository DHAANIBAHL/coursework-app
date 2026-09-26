// Each course lives in its own file under ./course-content. Each needs a
// unique `slug` — it becomes the URL: /course/<slug>
import webDesign from "./course-content/web-design.js";
import javascriptEssentials from "./course-content/javascript-essentials.js";
import introToNodejs from "./course-content/intro-to-nodejs.js";
import pythonForBeginners from "./course-content/python-for-beginners.js";
import artificialIntelligence from "./course-content/artificial-intelligence.js";
import machineLearning from "./course-content/machine-learning.js";
import sqlDatabases from "./course-content/sql-databases.js";

export const courses = [
  webDesign,
  javascriptEssentials,
  introToNodejs,
  pythonForBeginners,
  artificialIntelligence,
  machineLearning,
  sqlDatabases,
];

// Look up one course by its slug. Returns undefined if no match.
export function getCourse(slug) {
  return courses.find((course) => course.slug === slug);
}

// Look up one quiz inside a course by its id. Returns undefined if no match.
export function getQuiz(course, quizId) {
  return course?.quizzes.find((quiz) => quiz.id === quizId);
}
