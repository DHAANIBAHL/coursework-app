# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint over the whole project
- `npm run preview` — serve the production build

There is no test suite.

## Stack

React 19 + Vite, plain JavaScript (JSX, no TypeScript), react-router-dom v7, Tailwind CSS v4 (via `@tailwindcss/vite`, no tailwind config file; theme lives in `src/index.css`), and shadcn/ui components (`base-nova` style, built on `@base-ui/react`) in `src/components/ui/`. Icons come from `lucide-react`. The `@/` import alias maps to `src/`.

## Architecture

**Content is data, not components.** Each course is one file in `src/data/course-content/<slug>.js` (default export). `src/data/courses.js` imports them into the ordered `courses` array and exports `getCourse(slug)` and `getQuiz(course, quizId)`; a new course must be added to that array. Each course has `slug` (becomes the URL `/course/<slug>`), `tag`, `title`, `image` (path under `public/images/`), `color`, `description`, `lessons`, and `quizzes`. Pages derive everything from this data (catalog lesson/quiz totals, card labels, the quiz list on the course page), so adding content means editing data files only.

- Lesson shape: `{ title, body, code?, after? }`. `code` is a template literal, so backticks and `${` inside code samples must be escaped (`` \` ``, `\${`).
- Quiz shape: `{ id, title, description, questions }`. `id` is kebab-case and becomes the URL `/course/<slug>/quiz/<id>`. Each quiz covers a consecutive section of lessons, and `description` starts with that range ("Lessons 1–6: …").
- Question shape: `{ id, prompt, options: [{ id, text }], correct, explanation }`, where `correct` is the matching option `id`. Question ids restart at `q1` in each quiz.

`src/components/courses.js` is an older, unused copy of the data. Nothing imports it; edit the files in `src/data/course-content/` instead.

**Routing and auth.** `main.jsx` wraps `<App>` in `BrowserRouter` and `AuthProvider`. `App.jsx` defines the routes; `/` (catalog), `/course/:slug`, and `/course/:slug/quiz/:quizId` are wrapped in `RequireAuth`, which redirects to `/login` and passes `state.from` so login can return the user to where they were headed. `QuizPage` keeps answers in local state only; scores are not saved anywhere yet. `/help` and `/contact` are public (the header links to them for guests too). `/my-learning` is linked from the header but has no page yet.

**Help answers describe current behavior.** `HelpPage.jsx` has FAQ text about accounts, the 7-day login, no password reset, and unsaved quiz scores. Update it when those change. `ContactPage.jsx` still saves messages to `localStorage` (`coursework-messages`); there's no contact endpoint on the server yet.

**Auth runs on a separate Express + MySQL server** in the sibling folder `../coursework-server` (routes in `routes/auth.js`, table in `schema.sql`, config in `.env` from `.env.example`). Vite proxies `/api` to `http://localhost:4000` (see `vite.config.js`), so both must be running in development: `npm run dev` in each folder. The server's `npm start` doesn't watch files, so it must be restarted after server code changes.

- Session is a JWT in an httpOnly cookie (`coursework_token`, 7 days); the frontend never sees the token. `AuthContext` calls `GET /api/auth/me` on load and exposes `{ user, loading, signup, login, logout }`; pages must wait for `loading` to be false before redirecting.
- Endpoints: `POST /api/auth/signup` (201, or 409 if the email exists), `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` (`{ user: null }` when logged out).
- Login errors carry a `code` that `AuthContext`'s `request()` copies onto the thrown `Error`: `NO_ACCOUNT` (404) makes `LoginPage` offer sign-up and pass the email to `SignupPage` via router state; `WRONG_PASSWORD` is 401.
- `LoginPage` and `SignupPage` share `AuthShell` and the form pieces in `AuthForm.jsx`.
