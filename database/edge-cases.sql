-- Edge-case course catalog, for testing how the site copes with awkward data.
-- Load it into a throwaway database, never into learning_platform:
--
--   mysql -u root -p -e "CREATE DATABASE lp_edge;"
--   mysql -u root -p lp_edge < database/schema.sql
--   mysql -u root -p lp_edge < database/edge-cases.sql
--
-- then start the server with CATALOG_DB_NAME=lp_edge (see database/README.md).
-- It covers: a course with the real slug web-design but only 3 lessons (so
-- live progress runs past the end), unicode, quotes and <script> text, a
-- course with no lessons, a module with no lessons, a quiz with no questions,
-- an unpublished quiz, draft and archived courses, and two courses sharing a
-- catalog position. Admin -> Overview -> Data flow check lists what doesn't fit.
SET NAMES utf8mb4;

INSERT INTO categories (id, name, position) VALUES
  (1, 'Design', 1), (2, 'Programming', 2), (3, 'Unused Category', 3);

INSERT INTO courses (id, slug, category_id, title, description, image_url, color, position, status) VALUES
  -- Same slug as a real course with live enrollments, but only 3 lessons (real one has 18).
  (1, 'web-design', 1, 'Introduction to Web Design', 'Shrunk to 3 lessons to test progress that is larger than the course.', '/images/Web design.jpg', 'bg-blue-400', 1, 'published'),
  -- No image: the card should show the category on the colour block. Unicode, quotes, long text.
  (2, 'edge-unicode', 2, 'Café & O''Brien''s “Guide” — 日本語 <b>not bold</b>', REPEAT('A long description with <script>alert(1)</script> and émojis 🚀. ', 6), NULL, 'bg-violet-600', 2, 'published'),
  -- Published, but nothing in it yet.
  (3, 'edge-empty', 2, 'Empty Course', 'No modules, lessons or quizzes yet.', NULL, 'bg-slate-700', 3, 'published'),
  -- A module without lessons, a quiz with no questions, and an unpublished quiz.
  (4, 'edge-gaps', 1, 'Course With Gaps', 'A module with no lessons and a quiz with no questions.', NULL, 'bg-teal-600', 4, 'published'),
  -- Must never appear anywhere.
  (5, 'edge-draft', 1, 'Draft Course (hidden)', 'Not published yet.', NULL, 'bg-red-600', 5, 'draft'),
  (6, 'edge-archived', 1, 'Archived Course (hidden)', 'Archived.', NULL, 'bg-red-600', 6, 'archived'),
  -- Same position as edge-unicode: ties break by id.
  (7, 'edge-tie', 2, 'Tied Position', 'Same position as the unicode course.', NULL, 'bg-amber-600', 2, 'published');

INSERT INTO modules (id, course_id, position, title, summary) VALUES
  (1, 1, 1, 'HTML Foundations', NULL),
  (2, 2, 1, 'Ünïcödé Module', 'Summary with "quotes" & <tags>.'),
  (3, 4, 1, 'Has Lessons', NULL),
  (4, 4, 2, 'No Lessons Yet', 'This module is empty.'),
  (5, 5, 1, 'Draft Module', NULL),
  (6, 7, 1, 'Only Module', NULL);

INSERT INTO lessons (id, course_id, module_id, position, title, body, code, after_text, video_url) VALUES
  (1, 1, 1, 1, 'HTML Basics', 'Every page starts with <html>.', '<!doctype html>\n<html></html>', NULL, '/videos/Introduction to Web design/C1L1 (Web design).mp4'),
  (2, 1, 1, 2, 'The Document Head', 'Head holds metadata.', NULL, 'After text.', NULL),
  (3, 1, 1, 3, 'Semantic HTML', 'Use the right element.', NULL, NULL, NULL),
  (4, 2, 2, 1, 'Template literals: `${name}`', 'Body with <script>alert("x")</script> that must show as text.', 'const s = `Hi ${name}`;\nconsole.log(\'quote\');', 'Line one\nLine two', NULL),
  (5, 4, 3, 1, 'Only Lesson', 'The one lesson in this course.', NULL, NULL, NULL),
  (6, 5, 5, 1, 'Draft Lesson About Zebras', 'Searching for zebras must not find this.', NULL, NULL, NULL),
  (7, 7, 6, 1, 'Tie Lesson', 'Body.', NULL, NULL, NULL);

INSERT INTO quizzes (id, course_id, origin, slug, kind, title, description, first_lesson_id, last_lesson_id, published) VALUES
  (1, 1, 'catalog', 'html-foundations', 'quiz', 'HTML Foundations', 'Lessons 1–3: basics.', 1, 3, TRUE),
  (2, 2, 'catalog', 'unicode-quiz', 'quiz', 'Ünïcödé Quiz', 'Lessons 1–1: unicode.', 4, 4, TRUE),
  (3, 4, 'catalog', 'empty-quiz', 'quiz', 'Quiz With No Questions', 'Lessons 1–1: nothing to ask yet.', 5, 5, TRUE),
  (4, 4, 'catalog', 'hidden-quiz', 'quiz', 'Unpublished Quiz', 'Not ready.', 5, 5, FALSE),
  (5, 5, 'catalog', 'draft-quiz', 'quiz', 'Draft Course Quiz', 'Hidden course.', 6, 6, TRUE);

INSERT INTO quiz_questions (id, quiz_id, position, prompt, explanation) VALUES
  (1, 1, 1, 'Which tag wraps the page?', 'The html element is the root.'),
  (2, 1, 2, 'Where does <title> go?', NULL),
  (3, 2, 1, 'What does `${x}` do in a template literal?', 'It inserts the value of x.'),
  (4, 4, 1, 'Hidden question?', 'Hidden.'),
  (5, 5, 1, 'Draft question?', 'Draft.');

INSERT INTO quiz_options (id, question_id, position, text, is_correct) VALUES
  (1, 1, 1, '<html>', TRUE), (2, 1, 2, '<body>', FALSE),
  (3, 2, 1, 'In <head>', TRUE), (4, 2, 2, 'In <body>', FALSE), (5, 2, 3, 'Anywhere', FALSE), (6, 2, 4, 'Nowhere', FALSE), (7, 2, 5, 'In <footer>', FALSE), (8, 2, 6, 'In <nav>', FALSE),
  (9, 3, 1, 'Inserts x', TRUE), (10, 3, 2, 'Prints "${x}"', FALSE),
  (11, 4, 1, 'a', TRUE), (12, 4, 2, 'b', FALSE),
  (13, 5, 1, 'a', TRUE), (14, 5, 2, 'b', FALSE);
