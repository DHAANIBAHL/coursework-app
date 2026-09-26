const sqlDatabases = {
  slug: "sql-databases",
  tag: "Database",
  title: "SQL & Databases",
  image: "/images/SQL.png",
  color: "bg-slate-700",
  description: "How relational databases are structured, writing basic queries, and connecting them to your app.",
  lessons: [
    {
      title: "What a Relational Database Is",
      body: "A relational database stores data in tables, like spreadsheets with strict rules. Each row is one record, each column is one field, and tables can link to each other.",
      code: `students
+----+--------+-------------+
| id | name   | city        |
+----+--------+-------------+
| 1  | Asha   | Hyderabad   |
| 2  | Rohan  | Bengaluru   |
+----+--------+-------------+`,
      after: "SQL is the language you use to ask the database questions and change its data.",
    },
    {
      title: "Creating Tables",
      body: "CREATE TABLE defines a table's columns and the type of data each one holds. Constraints like NOT NULL stop bad data from getting in.",
      code: `CREATE TABLE students (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE,
  city       TEXT,
  created_at DATE DEFAULT CURRENT_DATE
);`,
      after: "UNIQUE on email means no two students can sign up with the same address.",
    },
    {
      title: "Inserting Rows",
      body: "INSERT INTO adds new rows. List the columns you're filling, then the values in the same order.",
      code: `INSERT INTO students (name, email, city)
VALUES ('Asha', 'asha@example.com', 'Hyderabad');

INSERT INTO students (name, email, city)
VALUES
  ('Rohan', 'rohan@example.com', 'Bengaluru'),
  ('Meera', 'meera@example.com', 'Chennai');`,
      after: "Text values go in single quotes; numbers don't need quotes.",
    },
    {
      title: "Selecting Data",
      body: "SELECT reads data from a table. Name the columns you want, or use * for all of them.",
      code: `SELECT * FROM students;

SELECT name, city FROM students;

SELECT name AS student_name FROM students;`,
      after: "In real apps, list the columns you need instead of using * — it's faster and clearer.",
    },
    {
      title: "Filtering with WHERE",
      body: "WHERE keeps only the rows that match a condition. Combine conditions with AND and OR, and use LIKE for partial text matches.",
      code: `SELECT name FROM students
WHERE city = 'Hyderabad';

SELECT name FROM students
WHERE city = 'Chennai' OR city = 'Bengaluru';

SELECT name FROM students
WHERE email LIKE '%@example.com';`,
      after: "In LIKE patterns, % means any number of characters.",
    },
    {
      title: "Matching Lists and Ranges",
      body: "IN checks whether a value is one of a list, which is shorter than chaining many ORs. BETWEEN checks whether a value falls inside a range of numbers or dates.",
      code: `SELECT name FROM students
WHERE city IN ('Hyderabad', 'Chennai', 'Pune');

SELECT name FROM students
WHERE city NOT IN ('Mumbai', 'Delhi');

SELECT name FROM students
WHERE created_at BETWEEN '2024-01-01' AND '2024-06-30';`,
      after: "BETWEEN includes both ends, so students who joined on the first or last date are part of the results.",
    },
    {
      title: "Working with NULL",
      body: "NULL means a value is missing or unknown, not zero or empty text. You can't compare it with =, so use IS NULL or IS NOT NULL, and COALESCE to swap in a fallback value.",
      code: `-- Wrong: this never matches any row
SELECT name FROM students WHERE city = NULL;

-- Right
SELECT name FROM students WHERE city IS NULL;

SELECT name FROM students WHERE city IS NOT NULL;

SELECT name, COALESCE(city, 'Unknown') AS city
FROM students;`,
      after: "Any comparison with NULL gives unknown rather than true, which is why = NULL silently returns no rows.",
    },
    {
      title: "Sorting and Limiting",
      body: "ORDER BY sorts results, ascending by default or descending with DESC. LIMIT caps how many rows come back.",
      code: `SELECT name, created_at
FROM students
ORDER BY created_at DESC
LIMIT 5;`,
      after: "This is how you'd show the five newest sign-ups on a dashboard.",
    },
    {
      title: "Updating and Deleting",
      body: "UPDATE changes existing rows and DELETE removes them. Both need a WHERE clause, or they affect every row in the table.",
      code: `UPDATE students
SET city = 'Mumbai'
WHERE id = 2;

DELETE FROM students
WHERE id = 3;

-- Danger: this deletes EVERYTHING
-- DELETE FROM students;`,
      after: "Run the same WHERE with a SELECT first to see exactly which rows you're about to change.",
    },
    {
      title: "Changing a Table's Structure",
      body: "ALTER TABLE changes a table that already exists, adding, renaming, or removing columns without losing its rows. DROP TABLE deletes the whole table along with all its data.",
      code: `ALTER TABLE students ADD COLUMN phone TEXT;

ALTER TABLE students ADD COLUMN year INTEGER DEFAULT 1;

ALTER TABLE students RENAME COLUMN phone TO mobile;

ALTER TABLE students DROP COLUMN mobile;

-- Danger: removes the table and every row in it
-- DROP TABLE students;`,
      after: "A new column with a DEFAULT fills that value into every existing row, so old records aren't left empty.",
    },
    {
      title: "Aggregates and GROUP BY",
      body: "Aggregate functions like COUNT, SUM, and AVG summarize many rows into one value. GROUP BY calculates them separately for each group.",
      code: `SELECT COUNT(*) FROM students;

SELECT city, COUNT(*) AS total
FROM students
GROUP BY city
ORDER BY total DESC;

SELECT city, COUNT(*) AS total
FROM students
GROUP BY city
HAVING COUNT(*) > 10;`,
      after: "WHERE filters rows before grouping; HAVING filters groups after.",
    },
    {
      title: "Primary and Foreign Keys",
      body: "A primary key uniquely identifies each row. A foreign key in another table points to it, which is how tables relate to each other.",
      code: `CREATE TABLE courses (
  id    INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE enrollments (
  id         INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  course_id  INTEGER REFERENCES courses(id)
);`,
      after: "The enrollments table connects students to courses, so one student can take many courses.",
    },
    {
      title: "Joining Tables",
      body: "JOIN combines rows from related tables using their keys. INNER JOIN keeps only matches; LEFT JOIN keeps every row from the first table even without a match.",
      code: `SELECT students.name, courses.title
FROM enrollments
JOIN students ON students.id = enrollments.student_id
JOIN courses  ON courses.id  = enrollments.course_id;

-- Students with no enrollments show NULL for title
SELECT s.name, c.title
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
LEFT JOIN courses c     ON c.id = e.course_id;`,
      after: "Short aliases like s and c keep long joins readable.",
    },
    {
      title: "Subqueries",
      body: "A subquery is a query inside another query, wrapped in parentheses. The inner query runs first and its result feeds the outer one.",
      code: `-- Students enrolled in at least one course
SELECT name FROM students
WHERE id IN (SELECT student_id FROM enrollments);

-- Courses with more than 50 students
SELECT title FROM courses
WHERE id IN (
  SELECT course_id FROM enrollments
  GROUP BY course_id
  HAVING COUNT(*) > 50
);`,
      after: "If a subquery gets hard to read, a JOIN can often answer the same question more clearly.",
    },
    {
      title: "Designing a Schema",
      body: "Good schema design stores each fact in exactly one place, which is called normalization. Instead of repeating the same details in many rows, move them into their own table and link to it with a foreign key.",
      code: `-- Repeated: teacher details copied into every course row
-- courses(id, title, teacher_name, teacher_email)

-- Normalized: each teacher is stored once
CREATE TABLE teachers (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE courses (
  id         INTEGER PRIMARY KEY,
  title      TEXT NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id)
);`,
      after: "Now a teacher's email changes in one row instead of in every course they teach.",
    },
    {
      title: "Indexes",
      body: "An index is a lookup structure that makes searching a column much faster, like the index at the back of a book. The trade-off is slightly slower writes and extra storage.",
      code: `CREATE INDEX idx_students_city ON students(city);

-- Now this is fast even with millions of rows
SELECT name FROM students WHERE city = 'Hyderabad';`,
      after: "Index the columns you filter or join on often — not every column.",
    },
    {
      title: "Transactions",
      body: "A transaction groups several statements so they all succeed or all fail together. BEGIN starts it, COMMIT saves it, and ROLLBACK undoes everything since BEGIN.",
      code: `BEGIN;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

COMMIT;

-- If something goes wrong partway through, undo it all:
-- ROLLBACK;`,
      after: "Use a transaction whenever a half-finished change would leave your data wrong, like money leaving one account but never arriving in the other.",
    },
    {
      title: "Connecting from Your App",
      body: "Your Node app talks to the database through a driver package. Always pass user input as parameters instead of pasting it into the query text, which protects you from SQL injection.",
      code: `import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/api/students", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT name, city FROM students WHERE city = $1",
    [req.query.city]
  );
  res.json(rows);
});`,
      after: "The $1 placeholder is filled in safely by the driver, so a malicious value can't change your query.",
    },
  ],
  quizzes: [
    {
      id: "database-basics",
      title: "Database Basics",
      description: "Lessons 1–6: tables, inserting rows, and reading data with SELECT, WHERE, IN, and BETWEEN.",
      questions: [
        { id: "q1", prompt: "In a relational database table, what does each row represent?", options: [{ id: "a", text: "One field" }, { id: "b", text: "One record" }, { id: "c", text: "One table" }, { id: "d", text: "One query" }], correct: "b", explanation: "Each row is one record, while each column is one field." },
        { id: "q2", prompt: "What does adding UNIQUE to the email column do?", options: [{ id: "a", text: "Requires every student to have an email" }, { id: "b", text: "Makes email the primary key" }, { id: "c", text: "Stops two rows from having the same email" }, { id: "d", text: "Sorts rows by email" }], correct: "c", explanation: "UNIQUE means no two students can sign up with the same address." },
        { id: "q3", prompt: "How should text values be written in an INSERT statement?", options: [{ id: "a", text: "In single quotes" }, { id: "b", text: "In double quotes" }, { id: "c", text: "Without any quotes" }, { id: "d", text: "Inside square brackets" }], correct: "a", explanation: "Text values go in single quotes, while numbers don't need quotes." },
        { id: "q4", prompt: "What does SELECT * FROM students return?", options: [{ id: "a", text: "Only the first row" }, { id: "b", text: "Only the id column" }, { id: "c", text: "The number of rows" }, { id: "d", text: "Every column of every row" }], correct: "d", explanation: "The * means all columns, and without a WHERE every row is returned." },
        { id: "q5", prompt: "In the LIKE pattern '%@example.com', what does % mean?", options: [{ id: "a", text: "Exactly one character" }, { id: "b", text: "Any number of characters" }, { id: "c", text: "Any digit" }, { id: "d", text: "The end of the text" }], correct: "b", explanation: "In LIKE patterns, % matches any number of characters." },
        { id: "q6", prompt: "Which WHERE clause matches students from either Hyderabad or Chennai?", options: [{ id: "a", text: "WHERE city = 'Hyderabad', 'Chennai'" }, { id: "b", text: "WHERE city LIKE ('Hyderabad', 'Chennai')" }, { id: "c", text: "WHERE city IN ('Hyderabad', 'Chennai')" }, { id: "d", text: "WHERE city BETWEEN 'Hyderabad' AND 'Chennai'" }], correct: "c", explanation: "IN checks whether a value is one of a list, which is shorter than chaining ORs." },
        { id: "q7", prompt: "With BETWEEN '2024-01-01' AND '2024-06-30', are the two end dates included?", options: [{ id: "a", text: "Yes, both are included" }, { id: "b", text: "No, neither is included" }, { id: "c", text: "Only the first date" }, { id: "d", text: "Only the last date" }], correct: "a", explanation: "BETWEEN includes both ends of the range." },
        { id: "q8", prompt: "Why is it better to list columns instead of using * in real apps?", options: [{ id: "a", text: "* is not valid SQL" }, { id: "b", text: "* only returns the first column" }, { id: "c", text: "PostgreSQL requires column names" }, { id: "d", text: "It's faster and makes the query clearer" }], correct: "d", explanation: "Listing only the columns you need is faster and clearer than *." },
      ],
    },
    {
      id: "shaping-data",
      title: "Shaping Your Data",
      description: "Lessons 7–12: NULL, sorting, changing rows and tables, aggregates, and keys.",
      questions: [
        { id: "q1", prompt: "Why does WHERE city = NULL return no rows?", options: [{ id: "a", text: "NULL is stored as the text 'NULL'" }, { id: "b", text: "Any comparison with NULL is unknown, not true" }, { id: "c", text: "The column must be indexed first" }, { id: "d", text: "NULL only works with numbers" }], correct: "b", explanation: "Comparing with NULL gives unknown, so you need IS NULL instead of = NULL." },
        { id: "q2", prompt: "What does COALESCE(city, 'Unknown') return?", options: [{ id: "a", text: "The city, or 'Unknown' when city is NULL" }, { id: "b", text: "'Unknown' for every row" }, { id: "c", text: "Nothing; it deletes rows where city is NULL" }, { id: "d", text: "The number of NULL cities" }], correct: "a", explanation: "COALESCE swaps in a fallback value when the first value is NULL." },
        { id: "q3", prompt: "What does ORDER BY created_at DESC LIMIT 5 return?", options: [{ id: "a", text: "The five oldest rows" }, { id: "b", text: "Five random rows" }, { id: "c", text: "The five most recent rows" }, { id: "d", text: "Every row except five" }], correct: "c", explanation: "DESC sorts newest first and LIMIT 5 keeps only the first five rows." },
        { id: "q4", prompt: "What happens if you run UPDATE students SET city = 'Mumbai'; with no WHERE?", options: [{ id: "a", text: "SQL refuses and returns an error" }, { id: "b", text: "Only the first row changes" }, { id: "c", text: "Only the last inserted row changes" }, { id: "d", text: "Every row in the table changes" }], correct: "d", explanation: "Without a WHERE clause, UPDATE and DELETE affect every row." },
        { id: "q5", prompt: "Which statement adds a phone column to an existing students table?", options: [{ id: "a", text: "CREATE TABLE students (phone TEXT);" }, { id: "b", text: "ALTER TABLE students ADD COLUMN phone TEXT;" }, { id: "c", text: "INSERT INTO students (phone) VALUES ('');" }, { id: "d", text: "UPDATE students ADD phone TEXT;" }], correct: "b", explanation: "ALTER TABLE changes an existing table's structure without losing its rows." },
        { id: "q6", prompt: "What is the difference between WHERE and HAVING?", options: [{ id: "a", text: "There is no difference" }, { id: "b", text: "HAVING filters rows before grouping; WHERE filters groups after" }, { id: "c", text: "WHERE filters rows before grouping; HAVING filters groups after" }, { id: "d", text: "HAVING only works with ORDER BY" }], correct: "c", explanation: "WHERE filters individual rows first, and HAVING filters the groups GROUP BY produces." },
        { id: "q7", prompt: "What does a foreign key do?", options: [{ id: "a", text: "Points to the primary key of a row in another table" }, { id: "b", text: "Encrypts a column's values" }, { id: "c", text: "Makes a column faster to search" }, { id: "d", text: "Deletes rows that have no match" }], correct: "a", explanation: "A foreign key references another table's primary key, which is how tables relate." },
        { id: "q8", prompt: "What does SELECT city, COUNT(*) FROM students GROUP BY city return?", options: [{ id: "a", text: "Only the total number of students" }, { id: "b", text: "The number of columns in the table" }, { id: "c", text: "Each student's name next to their city" }, { id: "d", text: "The number of students in each city" }], correct: "d", explanation: "GROUP BY calculates the aggregate separately for each city." },
      ],
    },
    {
      id: "relations-and-apps",
      title: "Relations and Apps",
      description: "Lessons 13–18: joins, subqueries, schema design, indexes, transactions, and connecting from your app.",
      questions: [
        { id: "q1", prompt: "How does LEFT JOIN differ from INNER JOIN?", options: [{ id: "a", text: "LEFT JOIN keeps only matching rows" }, { id: "b", text: "LEFT JOIN keeps every row from the second table" }, { id: "c", text: "LEFT JOIN keeps every row from the first table, even without a match" }, { id: "d", text: "LEFT JOIN is faster but returns the same rows" }], correct: "c", explanation: "LEFT JOIN keeps all rows from the first table and fills missing matches with NULL." },
        { id: "q2", prompt: "In a query that contains a subquery, which part runs first?", options: [{ id: "a", text: "The inner query in parentheses" }, { id: "b", text: "The outer query" }, { id: "c", text: "Both run at the same time" }, { id: "d", text: "Whichever query is shorter" }], correct: "a", explanation: "The inner query runs first and its result feeds the outer query." },
        { id: "q3", prompt: "What is the main goal of normalization?", options: [{ id: "a", text: "Putting all data into one big table" }, { id: "b", text: "Adding an index to every column" }, { id: "c", text: "Making every column TEXT" }, { id: "d", text: "Storing each fact in exactly one place" }], correct: "d", explanation: "Normalization avoids repeated data by giving each fact one home and linking to it with keys." },
        { id: "q4", prompt: "What is the trade-off of adding an index?", options: [{ id: "a", text: "Reads become slower" }, { id: "b", text: "Slightly slower writes and extra storage" }, { id: "c", text: "Duplicate rows get deleted" }, { id: "d", text: "The column can no longer be used in WHERE" }], correct: "b", explanation: "Indexes speed up searches but cost a little on writes and storage." },
        { id: "q5", prompt: "Which columns are worth indexing?", options: [{ id: "a", text: "Every column in every table" }, { id: "b", text: "Only TEXT columns" }, { id: "c", text: "Columns you filter or join on often" }, { id: "d", text: "Columns you rarely query" }], correct: "c", explanation: "Index the columns you filter or join on often, not every column." },
        { id: "q6", prompt: "Inside a transaction, what does ROLLBACK do?", options: [{ id: "a", text: "Undoes every change since BEGIN" }, { id: "b", text: "Saves the changes permanently" }, { id: "c", text: "Starts a new transaction" }, { id: "d", text: "Deletes the table" }], correct: "a", explanation: "ROLLBACK cancels everything since BEGIN, so the changes all fail together." },
        { id: "q7", prompt: "Why pass user input as a $1 parameter instead of pasting it into the query text?", options: [{ id: "a", text: "It makes the query shorter" }, { id: "b", text: "SELECT requires parameters" }, { id: "c", text: "It caches the result" }, { id: "d", text: "The driver fills it in safely, preventing SQL injection" }], correct: "d", explanation: "Parameters are filled in safely by the driver, so a malicious value can't change the query." },
        { id: "q8", prompt: "Why use short aliases like s and c in a join?", options: [{ id: "a", text: "They create new tables" }, { id: "b", text: "They keep long joins readable" }, { id: "c", text: "They make the query run faster" }, { id: "d", text: "LEFT JOIN requires them" }], correct: "b", explanation: "Aliases are just short names that keep long joins readable." },
      ],
    },
  ],
};

export default sqlDatabases;
