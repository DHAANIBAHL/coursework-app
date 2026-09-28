const restApisAndHttp = {
  slug: "rest-apis-and-http",
  tag: "Backend",
  title: "REST APIs & HTTP",
  image: "",
  color: "bg-emerald-600",
  description: "How clients and servers actually talk, and how to design, secure, and call APIs that are a pleasure to use.",
  lessons: [
    {
      title: "How the Web Talks",
      body: "Every exchange on the web is a request from a client, like a browser or a mobile app, followed by a response from a server. The client always speaks first; the server only ever answers.",
      code: `# The browser (client) sends a request
GET /api/courses HTTP/1.1
Host: example.com

# The server sends back a response
HTTP/1.1 200 OK
Content-Type: application/json

[{ "id": 1, "title": "Web Design" }]`,
      after: "Each request stands on its own, so the server doesn't remember the last one unless you give it a way to, like a cookie.",
    },
    {
      title: "Anatomy of a URL",
      body: "A URL tells the client where to send a request. It's made of a scheme, a host, an optional port, a path, an optional query string, and an optional fragment.",
      code: `https://api.example.com:443/courses/42?sort=title&page=2#reviews

https://            scheme (protocol)
api.example.com     host (domain)
:443                port (optional; 443 is the https default)
/courses/42         path
?sort=title&page=2  query string
#reviews            fragment (never sent to the server)`,
      after: "The fragment stays in the browser, so never rely on the server seeing anything after the #.",
    },
    {
      title: "HTTP Methods and Idempotency",
      body: "The method says what the client wants done to the thing at that URL. Safe methods like GET only read, and idempotent methods give the same result whether you send them once or five times.",
      code: `GET    /courses      read data (safe, idempotent)
POST   /courses      create something new (not idempotent)
PUT    /courses/42   replace course 42 entirely (idempotent)
PATCH  /courses/42   change some fields of course 42
DELETE /courses/42   remove course 42 (idempotent)

# Sending the same PUT twice leaves the same result.
# Sending the same POST twice can create two courses.`,
      after: "Idempotent requests are safe to retry after a network glitch; retrying a POST needs extra care.",
    },
    {
      title: "Status Codes",
      body: "Every response starts with a three-digit status code. The first digit gives the family: 2xx means success, 3xx means look elsewhere, 4xx means the client made a mistake, and 5xx means the server did.",
      code: `200 OK                     it worked, here's the data
201 Created                a new resource was made
204 No Content             it worked, nothing to send back
301 Moved Permanently      use the new URL from now on
400 Bad Request            the request itself was wrong
401 Unauthorized           you need to log in first
403 Forbidden              logged in, but not allowed
404 Not Found              nothing lives at this URL
500 Internal Server Error  the server broke`,
      after: "Pick the most specific code you can, because clients branch on the number, not the message.",
    },
    {
      title: "Headers",
      body: "Headers are name-value pairs that carry extra information about a request or response. They describe things like the body's format, who the caller is, and how long a response can be cached.",
      code: `# Request headers
GET /api/me HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer eyJhbGciOi...

# Response headers
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Set-Cookie: theme=dark; Path=/`,
      after: "Header names are case-insensitive, so content-type and Content-Type are the same header.",
    },
    {
      title: "JSON Bodies and Content Types",
      body: "Requests like POST and PUT carry data in a body, and most APIs send it as JSON. The Content-Type header tells the other side how to read the body, so it must match what you actually send.",
      code: `POST /api/courses HTTP/1.1
Content-Type: application/json

{ "title": "REST APIs", "lessons": 17 }

// Express: express.json() only parses bodies sent as JSON
app.post("/api/courses", (req, res) => {
  console.log(req.body.title); // "REST APIs"
  res.status(201).json(req.body);
});`,
      after: "If req.body comes back undefined, check that the client sent Content-Type: application/json.",
    },
    {
      title: "Inspecting Requests with DevTools and curl",
      body: "You can't fix what you can't see. The browser's Network tab shows every request a page makes, and curl lets you send requests by hand from the terminal.",
      code: `# DevTools: F12 -> Network tab -> click a request
#   Headers, Payload, and Response tabs show each part

# curl: -i prints the response headers too
curl -i https://api.example.com/courses

# Send JSON with POST
curl -X POST https://api.example.com/courses \\
  -H "Content-Type: application/json" \\
  -d '{"title": "REST APIs"}'`,
      after: "In Windows PowerShell, type curl.exe so you get real curl instead of the built-in alias.",
    },
    {
      title: "Designing Resources and URLs",
      body: "REST treats your data as resources, each with its own URL. Paths name things with plural nouns, and the HTTP method supplies the verb.",
      code: `# Good: plural nouns, nested for real relationships
GET /courses
GET /courses/42
GET /courses/42/lessons
GET /users/7/enrollments

# Avoid: verbs in the path, since the method already says it
GET  /getCourses
POST /createCourse
POST /courses/42/delete`,
      after: "Use lowercase and hyphens in paths, like /learning-paths, and keep nesting to one or two levels.",
    },
    {
      title: "Mapping CRUD to HTTP",
      body: "Create, read, update, and delete map neatly onto POST, GET, PUT or PATCH, and DELETE. PUT replaces the whole resource, while PATCH changes only the fields you send.",
      code: `app.get("/api/courses", listCourses);         // Read all
app.get("/api/courses/:id", getCourse);       // Read one
app.post("/api/courses", createCourse);       // Create -> 201
app.put("/api/courses/:id", replaceCourse);   // Replace
app.patch("/api/courses/:id", updateCourse);  // Update some fields
app.delete("/api/courses/:id", deleteCourse); // Delete -> 204

function deleteCourse(req, res) {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  courses.splice(index, 1);
  res.status(204).end();
}`,
      after: "A 204 response has no body, so end it with res.end() rather than res.json().",
    },
    {
      title: "Filtering, Sorting, and Pagination",
      body: "Query parameters let clients narrow down a list without new endpoints. A leading minus, like sort=-createdAt, is a common way to ask for descending order, and page and limit split long lists into chunks.",
      code: `// GET /api/courses?tag=backend&page=2&limit=10
app.get("/api/courses", (req, res) => {
  const { tag, page = "1", limit = "10" } = req.query;
  const results = tag ? courses.filter((c) => c.tag === tag) : courses;

  const start = (Number(page) - 1) * Number(limit);
  res.json({
    data: results.slice(start, start + Number(limit)),
    page: Number(page),
    total: results.length,
  });
});`,
      after: "Query values always arrive as strings, so convert numbers with Number() before doing math.",
    },
    {
      title: "Validation and Consistent Errors",
      body: "Never trust what a client sends; check it before you save it. When something is wrong, answer with the right status and the same error shape every time, so the frontend knows exactly where to look.",
      code: `function sendError(res, status, code, message, details) {
  res.status(status).json({ error: { code, message, details } });
}

app.post("/api/courses", (req, res) => {
  const errors = [];
  if (!req.body.title) errors.push({ field: "title", issue: "required" });
  if (req.body.title?.length > 100) errors.push({ field: "title", issue: "too long" });
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_FAILED", "Check the highlighted fields", errors);
  }
  // ...save the course and respond with 201
});`,
      after: "Give every error a stable code the frontend can check, like NO_ACCOUNT or EMAIL_TAKEN, instead of matching message text.",
    },
    {
      title: "Sessions, Cookies, and Tokens",
      body: "APIs need to know who is calling. With sessions, the server gives the browser a cookie that it sends back automatically; with tokens like a JWT, the client attaches the token in an Authorization header. A JWT is signed, so the server can trust it without a database lookup, and it can also be stored in an httpOnly cookie so page scripts can't read it.",
      code: `# Session cookie: the server sets it, the browser sends it back
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax

GET /api/me HTTP/1.1
Cookie: session=abc123

# Token: the client adds it to each request itself
GET /api/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...`,
      after: "JavaScript can't read HttpOnly cookies, which keeps them out of reach of injected scripts.",
    },
    {
      title: "CORS",
      body: "Browsers stop a page from reading responses from a different origin, meaning a different scheme, host, or port, unless the server allows it with CORS headers. For requests like a JSON POST, the browser first sends an OPTIONS \"preflight\" request to ask permission.",
      code: `# A page on http://localhost:5173 calls http://localhost:4000/api
# The browser checks the response for permission:
Access-Control-Allow-Origin: http://localhost:5173

// Express with the cors package
import cors from "cors";

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // allow cookies on cross-origin requests
}));`,
      after: "Only browsers enforce CORS; curl ignores it, and a dev proxy, like Vite forwarding /api to your server, avoids it entirely.",
    },
    {
      title: "Rate Limiting",
      body: "Rate limiting caps how many requests one client can make in a window of time. It protects your server from overload and makes guessing passwords on a login route painfully slow.",
      code: `import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,                 // 5 attempts per IP per window
  message: { error: "Too many attempts, try again later" },
});

app.post("/api/auth/login", loginLimiter, login);

// Over the limit, clients get:
// HTTP/1.1 429 Too Many Requests`,
      after: "Apply tight limits to sensitive routes like login and looser ones to everything else.",
    },
    {
      title: "Versioning Your API",
      body: "Once other apps depend on your API, changing a response shape can break them. Versioning lets you ship the new shape alongside the old one, most often with a version number in the URL.",
      code: `// Version in the URL: easy to see and test
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

// v1 keeps the old shape so existing apps don't break
// GET /api/v1/courses/42 -> { "name": "REST APIs" }
// GET /api/v2/courses/42 -> { "title": "REST APIs" }

# Some APIs use a header instead
GET /api/courses/42 HTTP/1.1
Accept-Version: 2`,
      after: "Adding a new field isn't breaking; renaming or removing one is, and that's when you bump the version.",
    },
    {
      title: "Calling APIs with fetch",
      body: "fetch sends requests from the browser and returns a promise. It only rejects on network failures, so a 404 or 500 still resolves and you must check res.ok yourself. In a React component, keep loading and error in state alongside the data.",
      code: `const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch("/api/courses")
    .then((res) => {
      if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
      return res.json();
    })
    .then(setCourses)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, []);`,
      after: "Show a spinner while loading and a readable message on error, so users never stare at a blank screen.",
    },
    {
      title: "Documenting and Testing APIs",
      body: "An OpenAPI file describes every endpoint, its parameters, and its responses in one machine-readable spec. Tools can turn it into interactive docs, and API clients let you save requests into collections and rerun them with checks on the status and body.",
      code: `# openapi.yaml (excerpt)
openapi: 3.1.0
info: { title: Courses API, version: 1.0.0 }
paths:
  /courses/{id}:
    get:
      summary: Get one course
      parameters:
        - { name: id, in: path, required: true, schema: { type: integer } }
      responses:
        "200": { description: The course }
        "404": { description: No course with that id }`,
      after: "Keep the spec in the same repo as the server and update it in the same commit as the route.",
    },
  ],
  quizzes: [
    {
      id: "http-fundamentals",
      title: "HTTP Fundamentals",
      description: "Lessons 1–6: requests and responses, URLs, methods, status codes, headers, and JSON bodies.",
      questions: [
        { id: "q1", prompt: "In the request/response model, who starts the conversation?", options: [{ id: "a", text: "The server" }, { id: "b", text: "The client" }, { id: "c", text: "The database" }, { id: "d", text: "Whichever side is ready first" }], correct: "b", explanation: "The client always sends a request first, and the server only answers." },
        { id: "q2", prompt: "Which part of a URL is never sent to the server?", options: [{ id: "a", text: "The path" }, { id: "b", text: "The query string" }, { id: "c", text: "The fragment" }, { id: "d", text: "The host" }], correct: "c", explanation: "Everything after the # stays in the browser." },
        { id: "q3", prompt: "In /courses/42?sort=title, what is sort=title?", options: [{ id: "a", text: "Part of the query string" }, { id: "b", text: "Part of the path" }, { id: "c", text: "The fragment" }, { id: "d", text: "The port" }], correct: "a", explanation: "Everything after the question mark is the query string." },
        { id: "q4", prompt: "Which of these methods is NOT idempotent?", options: [{ id: "a", text: "GET" }, { id: "b", text: "PUT" }, { id: "c", text: "DELETE" }, { id: "d", text: "POST" }], correct: "d", explanation: "Sending the same POST twice can create two resources." },
        { id: "q5", prompt: "What does a 204 status code mean?", options: [{ id: "a", text: "It worked, and there's nothing to send back" }, { id: "b", text: "Nothing lives at this URL" }, { id: "c", text: "A new resource was created" }, { id: "d", text: "The server broke" }], correct: "a", explanation: "204 No Content is a success with an empty body." },
        { id: "q6", prompt: "A logged-in user tries to open a page they aren't allowed to see. Which status fits?", options: [{ id: "a", text: "401" }, { id: "b", text: "404" }, { id: "c", text: "403" }, { id: "d", text: "500" }], correct: "c", explanation: "403 Forbidden means the user is known but not allowed; 401 means they need to log in." },
        { id: "q7", prompt: "What does the Content-Type header describe?", options: [{ id: "a", text: "The client's browser" }, { id: "b", text: "The user's session" }, { id: "c", text: "How long to cache the response" }, { id: "d", text: "The format of the body" }], correct: "d", explanation: "Content-Type tells the other side how to read the body, like application/json." },
        { id: "q8", prompt: "Why might req.body be undefined in an Express route that uses express.json()?", options: [{ id: "a", text: "The server is on the wrong port" }, { id: "b", text: "The client didn't send Content-Type: application/json" }, { id: "c", text: "The JSON was too short" }, { id: "d", text: "The route used app.post" }], correct: "b", explanation: "express.json() only parses bodies whose Content-Type says they are JSON." },
      ],
    },
    {
      id: "designing-rest-apis",
      title: "Designing REST APIs",
      description: "Lessons 7–12: inspecting requests, resource design, CRUD, query parameters, errors, and authentication.",
      questions: [
        { id: "q1", prompt: "What does the -i flag do in a curl command?", options: [{ id: "a", text: "Ignores errors" }, { id: "b", text: "Installs curl" }, { id: "c", text: "Includes the response headers in the output" }, { id: "d", text: "Sends the body as JSON" }], correct: "c", explanation: "curl -i prints the status line and headers along with the body." },
        { id: "q2", prompt: "In Windows PowerShell, how do you make sure you're running real curl?", options: [{ id: "a", text: "Type curl.exe" }, { id: "b", text: "Type curl --real" }, { id: "c", text: "Run PowerShell as administrator" }, { id: "d", text: "Add -i to the command" }], correct: "a", explanation: "Plain curl can be a built-in alias in PowerShell, while curl.exe runs the real tool." },
        { id: "q3", prompt: "Which path follows REST naming conventions?", options: [{ id: "a", text: "/getCourses" }, { id: "b", text: "/createCourse" }, { id: "c", text: "/courses/42/delete" }, { id: "d", text: "/courses/42/lessons" }], correct: "d", explanation: "REST paths use plural nouns and let the HTTP method supply the verb." },
        { id: "q4", prompt: "Which method and status fit deleting a course with nothing to return?", options: [{ id: "a", text: "POST and 200" }, { id: "b", text: "DELETE and 204" }, { id: "c", text: "GET and 404" }, { id: "d", text: "PUT and 201" }], correct: "b", explanation: "DELETE removes the resource, and 204 says it worked with an empty body." },
        { id: "q5", prompt: "What is the difference between PUT and PATCH?", options: [{ id: "a", text: "PUT replaces the whole resource; PATCH changes only the fields sent" }, { id: "b", text: "PATCH creates a resource; PUT deletes one" }, { id: "c", text: "PUT is only for files" }, { id: "d", text: "There is no difference" }], correct: "a", explanation: "PUT sends the full replacement, while PATCH sends just the changes." },
        { id: "q6", prompt: "Why wrap req.query.page in Number() before using it?", options: [{ id: "a", text: "To make the URL shorter" }, { id: "b", text: "To sort the results" }, { id: "c", text: "Express requires it for every query" }, { id: "d", text: "Query values always arrive as strings" }], correct: "d", explanation: "Query parameters are strings, so convert them before doing math." },
        { id: "q7", prompt: "Why give each error a stable code like VALIDATION_FAILED?", options: [{ id: "a", text: "It makes responses faster" }, { id: "b", text: "It replaces the status code" }, { id: "c", text: "The frontend can check it instead of matching message text" }, { id: "d", text: "HTTP requires it" }], correct: "c", explanation: "Messages can change, but a stable code gives the frontend something reliable to branch on." },
        { id: "q8", prompt: "How does a token-based API usually receive the token?", options: [{ id: "a", text: "In the URL fragment" }, { id: "b", text: "In an Authorization: Bearer header" }, { id: "c", text: "In the Content-Type header" }, { id: "d", text: "In the response body" }], correct: "b", explanation: "With tokens, the client attaches the token to each request in the Authorization header." },
      ],
    },
    {
      id: "production-ready-apis",
      title: "Production-Ready APIs",
      description: "Lessons 13–17: CORS, rate limiting, versioning, calling APIs with fetch, and documentation.",
      questions: [
        { id: "q1", prompt: "Which of these is a different origin from http://localhost:5173?", options: [{ id: "a", text: "http://localhost:5173/api" }, { id: "b", text: "http://localhost:5173/login" }, { id: "c", text: "http://localhost:5173/?page=2" }, { id: "d", text: "http://localhost:4000" }], correct: "d", explanation: "A different port makes a different origin, while paths and query strings don't." },
        { id: "q2", prompt: "Who enforces CORS?", options: [{ id: "a", text: "The server" }, { id: "b", text: "The browser" }, { id: "c", text: "curl" }, { id: "d", text: "The database" }], correct: "b", explanation: "Only browsers enforce CORS; the server just sends headers granting permission." },
        { id: "q3", prompt: "Which status code does a client get when it goes over a rate limit?", options: [{ id: "a", text: "429" }, { id: "b", text: "401" }, { id: "c", text: "404" }, { id: "d", text: "400" }], correct: "a", explanation: "429 Too Many Requests tells the client to slow down." },
        { id: "q4", prompt: "Which change should lead to a new API version?", options: [{ id: "a", text: "Adding a new optional field" }, { id: "b", text: "Fixing a typo in the docs" }, { id: "c", text: "Renaming a field that clients rely on" }, { id: "d", text: "Adding a new endpoint" }], correct: "c", explanation: "Renaming or removing a field breaks existing clients, so it needs a new version." },
        { id: "q5", prompt: "What does fetch do when the server responds with a 404?", options: [{ id: "a", text: "It rejects the promise" }, { id: "b", text: "It resolves normally, so you must check res.ok" }, { id: "c", text: "It retries the request" }, { id: "d", text: "It throws a CORS error" }], correct: "b", explanation: "fetch only rejects on network failures, so error statuses still resolve." },
        { id: "q6", prompt: "Why track loading and error state when fetching data?", options: [{ id: "a", text: "It makes fetch faster" }, { id: "b", text: "fetch won't run without them" }, { id: "c", text: "It caches the response" }, { id: "d", text: "So users see a spinner or message instead of a blank screen" }], correct: "d", explanation: "Loading and error states let the page show what's happening at every step." },
        { id: "q7", prompt: "What does an OpenAPI file describe?", options: [{ id: "a", text: "Endpoints, parameters, and responses in a machine-readable spec" }, { id: "b", text: "The database tables" }, { id: "c", text: "The site's CSS" }, { id: "d", text: "The server's environment variables" }], correct: "a", explanation: "OpenAPI documents every endpoint in a format tools can turn into docs and tests." },
      ],
    },
  ],
};

export default restApisAndHttp;
