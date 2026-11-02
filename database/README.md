# Course catalog database

The website's course content (courses, modules, lessons, built-in quizzes) lives in a MySQL database of its own, separate from the live `coursework` database that holds accounts and activity. The server reads it read-only; the database is named by `CATALOG_DB_NAME` in `coursework-server/.env` (default `learning_platform`). The model is described in [`docs/data-model.md`](../docs/data-model.md).

| File | What it is |
| --- | --- |
| `schema.sql` | Every table, for MySQL 8.0.16 or later. No `CREATE DATABASE` and no `DROP`: it builds the tables in whichever database you name, and stops at the first table that already exists. |
| `seed.sql` | **The source of truth for the content.** All 13 courses with their modules, lessons, quizzes, questions and options, plus mock people and activity (5 instructors, 20 students, 1 admin, enrollments, progress, quiz attempts, reviews; every mock password is `Demo@1234`). |

## Load it

```sh
mysql -u root -p -e "CREATE DATABASE learning_platform;"
mysql -u root -p learning_platform < database/schema.sql
mysql -u root -p learning_platform < database/seed.sql
```

To start over, drop and recreate the database and run the three commands again.

## Change content

Course content used to be JavaScript files in `src/data/`; they are gone, and nothing generates `seed.sql` any more. To change a course:

1. Edit the rows in `learning_platform` (any MySQL client). The site shows the change on the next page load; Admin → Overview → **Data source status** shows live counts.
2. Write the database back to `seed.sql`, so the change is kept and reaches everyone who loads the seed:

   ```sh
   mysqldump -u root -p --no-create-info --skip-triggers --set-gtid-purged=OFF \
     --skip-extended-insert --complete-insert --skip-dump-date \
     learning_platform > database/seed.sql
   ```

   This writes one `INSERT` per row, so later diffs show exactly which rows changed. (The first export also reformats the hand-written seed into this style.) Loading the export into a fresh database gives tables with identical checksums.
3. Commit `seed.sql` in a PR like any other change.

Keep these unchanged once published, because the live `coursework` database refers to them by text:

- a course's `slug` (enrollments, progress, scores and teacher assignments are stored by slug), and
- a built-in quiz's `slug` (scores are stored as `builtin:<quiz slug>`).

A lesson's `position` counts across the whole course and is how progress is stored, so add new lessons at the end of a course rather than in the middle.
