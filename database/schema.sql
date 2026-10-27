-- Coursework schema for MySQL 8 (8.0.16 or later), following docs/data-model.md.
--
-- This is the proposed model, not the schema the server runs on today
-- (that one is coursework-server/schema.sql plus its migrations). Load it
-- into a new, empty database, then load the mock data:
--
--   mysql -u root -p -e "CREATE DATABASE learning_platform;"
--   mysql -u root -p learning_platform < database/schema.sql
--   mysql -u root -p learning_platform < database/seed.sql
--
-- There are no DROP statements: pointed at a database that already has these
-- tables (such as the live one), it stops at the first CREATE TABLE without
-- changing anything. To start over, drop and recreate the database.

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,                 -- bcrypt
  role          ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  bio           VARCHAR(500) NULL,                     -- shown with "Taught by"
  avatar_url    VARCHAR(500) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Course catalog
-- ---------------------------------------------------------------------------

CREATE TABLE categories (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(60) NOT NULL UNIQUE,                -- the tag on course cards
  position INT NOT NULL DEFAULT 0
) ENGINE = InnoDB;

CREATE TABLE courses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,            -- URL /course/<slug>
  category_id INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  image_url   VARCHAR(500) NULL,                       -- NULL shows the category on `color`
  color       VARCHAR(40) NOT NULL,                    -- Tailwind class, e.g. bg-blue-400
  position    INT NOT NULL DEFAULT 0,                  -- catalog order
  status      ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (status, position),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE = InnoDB;

-- A course is split into modules; each module holds a run of lessons.
CREATE TABLE modules (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  position   INT NOT NULL,                             -- 1-based order in the course
  title      VARCHAR(200) NOT NULL,
  summary    VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (course_id, position),
  UNIQUE (id, course_id),                              -- target of the lessons FK below
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE lessons (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  module_id  INT NOT NULL,
  position   INT NOT NULL,                             -- 1-based across the whole course (#lesson-<n>)
  title      VARCHAR(200) NOT NULL,
  body       TEXT NOT NULL,
  code       TEXT NULL,                                -- code sample
  after_text TEXT NULL,                                -- text shown after the code sample
  video_url  VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (course_id, position),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  -- The module must belong to the same course as the lesson.
  FOREIGN KEY (module_id, course_id) REFERENCES modules(id, course_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE course_teachers (
  course_id   INT NOT NULL,
  teacher_id  INT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (course_id, teacher_id),
  INDEX (teacher_id),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Learning
-- ---------------------------------------------------------------------------

CREATE TABLE enrollments (
  student_id  INT NOT NULL,
  course_id   INT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),
  INDEX (course_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- One review per student per course, and only from students who joined it:
-- the foreign key points at the enrollment, so leaving a course removes the review.
CREATE TABLE course_reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  student_id INT NOT NULL,
  rating     TINYINT NOT NULL,
  comment    TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (course_id, student_id),
  INDEX (student_id),
  CONSTRAINT course_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  FOREIGN KEY (student_id, course_id) REFERENCES enrollments(student_id, course_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE lesson_progress (
  student_id   INT NOT NULL,
  lesson_id    INT NOT NULL,
  completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, lesson_id),
  INDEX (lesson_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Quizzes and tests: catalog quizzes and teacher quizzes share these tables
-- ---------------------------------------------------------------------------

CREATE TABLE quizzes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  course_id       INT NOT NULL,
  origin          ENUM('catalog', 'teacher') NOT NULL,
  slug            VARCHAR(100) NULL,                   -- catalog quizzes: URL /course/<slug>/quiz/<slug>
  kind            ENUM('quiz', 'test') NOT NULL DEFAULT 'quiz',
  title           VARCHAR(200) NOT NULL,
  description     TEXT NULL,
  first_lesson_id INT NULL,                            -- the lessons a catalog quiz covers
  last_lesson_id  INT NULL,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  due_at          DATETIME NULL,
  time_limit_min  INT NULL,                            -- tests only; NULL = untimed
  max_attempts    INT NULL,                            -- NULL = unlimited
  created_by      INT NULL,                            -- NULL for catalog quizzes
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (course_id, slug),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (first_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
  FOREIGN KEY (last_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE quiz_questions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id     INT NOT NULL,
  position    INT NOT NULL,
  prompt      TEXT NOT NULL,
  explanation TEXT NULL,
  UNIQUE (quiz_id, position),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Exactly one correct option per question; the server checks this on save.
CREATE TABLE quiz_options (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  position    TINYINT NOT NULL,                        -- shown as a, b, c…
  text        VARCHAR(500) NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (question_id, position),
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- A timed test's start, so the server can enforce the time limit.
CREATE TABLE quiz_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id      INT NOT NULL,
  student_id   INT NOT NULL,
  started_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME NULL,
  INDEX (quiz_id, student_id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE quiz_attempts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id    INT NOT NULL,
  student_id INT NOT NULL,
  session_id INT NULL,                                 -- the timed start, for tests
  score      INT NOT NULL,
  total      INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (student_id, quiz_id),
  INDEX (quiz_id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE quiz_attempt_answers (
  attempt_id  INT NOT NULL,
  question_id INT NOT NULL,
  option_id   INT NULL,                                -- NULL = left blank
  PRIMARY KEY (attempt_id, question_id),
  INDEX (question_id),
  INDEX (option_id),
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES quiz_options(id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Classroom content posted by teachers
-- ---------------------------------------------------------------------------

CREATE TABLE assignments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  course_id    INT NOT NULL,
  title        VARCHAR(200) NOT NULL,
  instructions TEXT NOT NULL,
  due_at       DATETIME NOT NULL,
  max_points   INT NOT NULL DEFAULT 100,
  created_by   INT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (course_id, due_at),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE materials (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  course_id     INT NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT NULL,
  kind          ENUM('file', 'video', 'link') NOT NULL,
  file_name     VARCHAR(255) NULL,                     -- stored name inside uploads/
  original_name VARCHAR(255) NULL,                     -- name the teacher uploaded it with
  mime_type     VARCHAR(150) NULL,
  size_bytes    BIGINT NULL,
  url           VARCHAR(1000) NULL,                    -- for links
  created_by    INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (course_id),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE live_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  course_id    INT NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT NULL,
  starts_at    DATETIME NOT NULL,
  duration_min INT NOT NULL DEFAULT 60,
  meeting_url  VARCHAR(1000) NOT NULL,
  created_by   INT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (course_id, starts_at),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- At most one related_* column should be set. MySQL can't enforce that with a
-- CHECK here (CHECK may not use columns with ON DELETE SET NULL), so the server
-- checks it on save.
CREATE TABLE announcements (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  course_id             INT NOT NULL,
  title                 VARCHAR(200) NOT NULL,
  body                  TEXT NOT NULL,
  category              ENUM('general', 'assignment', 'quiz', 'test', 'live', 'video', 'material') NOT NULL DEFAULT 'general',
  publish_at            DATETIME NULL,                 -- NULL = draft; future = scheduled
  pinned                BOOLEAN NOT NULL DEFAULT FALSE,
  related_assignment_id INT NULL,
  related_quiz_id       INT NULL,
  related_session_id    INT NULL,
  related_material_id   INT NULL,
  created_by            INT NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (course_id, publish_at),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (related_assignment_id) REFERENCES assignments(id) ON DELETE SET NULL,
  FOREIGN KEY (related_quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL,
  FOREIGN KEY (related_session_id) REFERENCES live_sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (related_material_id) REFERENCES materials(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE submissions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id    INT NOT NULL,
  text_answer   TEXT NULL,
  file_name     VARCHAR(255) NULL,
  original_name VARCHAR(255) NULL,
  mime_type     VARCHAR(150) NULL,
  size_bytes    BIGINT NULL,
  submitted_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grade         INT NULL,
  feedback      TEXT NULL,
  graded_at     DATETIME NULL,
  graded_by     INT NULL,
  UNIQUE (assignment_id, student_id),
  INDEX (student_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Site content
-- ---------------------------------------------------------------------------

CREATE TABLE contact_topics (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  label    VARCHAR(100) NOT NULL UNIQUE,
  position INT NOT NULL DEFAULT 0,
  active   BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;

CREATE TABLE contact_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NULL,                                 -- set when the sender was logged in
  topic_id   INT NOT NULL,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  handled    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (handled, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (topic_id) REFERENCES contact_topics(id) ON DELETE RESTRICT
) ENGINE = InnoDB;

-- FAQs for the Help page and the landing page.
CREATE TABLE faq_entries (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  page     ENUM('help', 'landing') NOT NULL,
  section  VARCHAR(100) NULL,
  position INT NOT NULL,
  question VARCHAR(300) NOT NULL,
  answer   TEXT NOT NULL,
  INDEX (page, position)
) ENGINE = InnoDB;

-- Landing-page feature cards and "how it works" steps.
CREATE TABLE site_blocks (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  area     ENUM('feature', 'step') NOT NULL,
  position INT NOT NULL,
  icon     VARCHAR(40) NULL,                           -- a lucide-react icon name
  title    VARCHAR(120) NOT NULL,
  body     VARCHAR(500) NOT NULL,
  UNIQUE (area, position)
) ENGINE = InnoDB;
