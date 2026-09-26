const introToNodejs = {
  slug: "intro-to-nodejs",
  tag: "Backend",
  title: "Intro to Node.js",
  image: "/images/NodeJS.png",
  color: "bg-slate-900",
  description: "What Node actually is, how to stand up a server, and how npm fits into all of it.",
  lessons: [
    {
      title: "What Node.js Is",
      body: "Node.js runs JavaScript outside the browser, directly on your computer or a server. It uses the same V8 engine as Chrome, but swaps the DOM for tools that read files, talk to networks, and run servers.",
      code: `// hello.js
console.log("Hello from Node!");
console.log("Node version:", process.version);`,
      after: "There's no window or document in Node — those only exist in browsers.",
    },
    {
      title: "Running Your First Script",
      body: "You run a Node file from the terminal with the node command. Node reads the file, runs it, and prints output to the terminal.",
      code: `# In PowerShell, inside your project folder
node hello.js

# Start an interactive session to try things out
node
> 2 + 2
4`,
      after: "Press Ctrl+C twice to leave the interactive session.",
    },
    {
      title: "Modules: import and export",
      body: "Modules let you split code across files. Export what a file shares, and import it where you need it. Adding \"type\": \"module\" to package.json turns on the modern import syntax.",
      code: `// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from "./math.js";
console.log(add(2, 3)); // 5`,
      after: "Older Node code uses require() and module.exports instead. You'll see both in the wild.",
    },
    {
      title: "npm and package.json",
      body: "npm is Node's package manager. package.json lists your project's details, its dependencies, and scripts you can run with npm run.",
      code: `npm init -y          # creates package.json
npm install express  # adds a dependency

// package.json (excerpt)
{
  "type": "module",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}`,
      after: "Never edit node_modules by hand — delete it and run npm install to rebuild it from package.json.",
    },
    {
      title: "The Event Loop and Async Code",
      body: "Node runs your JavaScript on a single thread. Slow jobs like timers, file reads, and network requests are handed off, and the event loop runs their callbacks once they finish, so Node never sits idle waiting.",
      code: `console.log("Start");

setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("End");

// Output:
// Start
// End
// Timer finished`,
      after: "Code after an async call keeps running right away — use await when you need the result first.",
    },
    {
      title: "Reading and Writing Files",
      body: "The built-in fs module works with files. The promise version lets you use await, so you don't block other work while a file loads.",
      code: `import { readFile, writeFile } from "node:fs/promises";

await writeFile("notes.txt", "First note\\n");
const text = await readFile("notes.txt", "utf8");

console.log(text); // "First note"`,
      after: "The node: prefix makes it clear you're importing something built into Node, not from npm.",
    },
    {
      title: "Working with Paths",
      body: "File paths look different on Windows and Mac. The path module builds paths correctly for whatever system your code runs on.",
      code: `import path from "node:path";

const file = path.join("data", "users", "list.json");
console.log(file); // data\\users\\list.json on Windows

console.log(path.extname("photo.png")); // ".png"
console.log(path.basename("/a/b/c.txt")); // "c.txt"`,
      after: "Avoid gluing paths together with + and slashes; path.join handles it for you.",
    },
    {
      title: "process and Environment Variables",
      body: "The process object describes the running program. process.env holds environment variables — the standard place to keep settings like ports and secret keys out of your code.",
      code: `const port = process.env.PORT || 3000;
console.log(\`Starting on port \${port}\`);

// Command-line arguments
console.log(process.argv.slice(2));

// In PowerShell:
// $env:PORT=4000; node app.js`,
      after: "Secrets like API keys belong in environment variables, never in code you commit to Git.",
    },
    {
      title: "Loading Settings from a .env File",
      body: "Typing environment variables every time you start your app gets tedious. A .env file keeps them in one place, and Node's --env-file flag (or the dotenv package) loads them into process.env for you.",
      code: `# .env (in your project folder)
PORT=4000
API_KEY=abc123

// app.js
console.log(process.env.PORT); // "4000"

# Start Node with the file loaded
node --env-file=.env app.js`,
      after: "Add .env to your .gitignore so your secrets never end up on GitHub.",
    },
    {
      title: "Your First HTTP Server",
      body: "Node's built-in http module can run a web server with no extra packages. Each request gets a req object describing it and a res object for sending a reply.",
      code: `import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from my server!");
});

server.listen(3000, () => {
  console.log("Open http://localhost:3000");
});`,
      after: "This works, but routing many URLs by hand gets messy fast — that's why Express exists.",
    },
    {
      title: "Getting Started with Express",
      body: "Express is the most popular Node web framework. It gives you a clean way to answer different URLs with different responses.",
      code: `import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});`,
      after: "Restart the server after changes, or run node --watch app.js to restart automatically.",
    },
    {
      title: "Routes and URL Parameters",
      body: "Routes match a method and a path. A segment starting with a colon becomes a parameter you can read from req.params, just like the :slug in this app's course pages.",
      code: `app.get("/courses/:slug", (req, res) => {
  const { slug } = req.params;
  res.send(\`You asked for \${slug}\`);
});

// /search?q=python
app.get("/search", (req, res) => {
  res.send(\`Searching for \${req.query.q}\`);
});`,
      after: "req.params comes from the path; req.query comes from everything after the question mark.",
    },
    {
      title: "Middleware",
      body: "Middleware is a function that runs between the request arriving and your route answering it. It's used for logging, reading JSON bodies, checking logins, and more.",
      code: `// Built-in middleware: parse JSON request bodies
app.use(express.json());

// Your own middleware: log every request
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next(); // hand off to the next step
});`,
      after: "Forgetting to call next() leaves the request hanging with no response.",
    },
    {
      title: "Serving Static Files",
      body: "Static files are things like HTML pages, CSS, and images that are sent exactly as they are. The built-in express.static middleware serves a whole folder of them with one line.",
      code: `import express from "express";

const app = express();

// Serve everything in the "public" folder
app.use(express.static("public"));

// public/index.html -> http://localhost:3000/
// public/style.css  -> http://localhost:3000/style.css
// public/logo.png   -> http://localhost:3000/logo.png

app.listen(3000);`,
      after: "The folder name isn't part of the URL — public/style.css is served at /style.css.",
    },
    {
      title: "Building a JSON API",
      body: "APIs send data as JSON instead of HTML pages. res.json sends data, and status codes tell the client whether things worked.",
      code: `const courses = [{ id: 1, title: "Web Design" }];

app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.post("/api/courses", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const course = { id: courses.length + 1, title: req.body.title };
  courses.push(course);
  res.status(201).json(course);
});`,
      after: "201 means created, 400 means the request was wrong, and 404 means nothing was found.",
    },
    {
      title: "Handling Errors and Unknown Routes",
      body: "When no route matches, Express falls through to any middleware added after your routes, which is the place for a 404 reply. A middleware with four arguments is an error handler: Express sends thrown errors there so you can answer with a 500 instead of crashing.",
      code: `app.get("/boom", (req, res) => {
  throw new Error("Something broke");
});

// Unknown routes: add after all other routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler: Express spots it by its four arguments
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});`,
      after: "Log the real error on the server, but send users a simple message that doesn't leak details.",
    },
  ],
  quizzes: [
    {
      id: "node-basics",
      title: "Node Basics",
      description: "Lessons 1–5: what Node is, running scripts, modules, npm, and the event loop.",
      questions: [
        { id: "q1", prompt: "What does Node.js let you do?", options: [{ id: "a", text: "Style web pages with CSS" }, { id: "b", text: "Run JavaScript outside the browser" }, { id: "c", text: "Edit the DOM of a web page" }, { id: "d", text: "Replace HTML with JavaScript" }], correct: "b", explanation: "Node runs JavaScript directly on your computer or a server, outside any browser." },
        { id: "q2", prompt: "Which of these does NOT exist in Node?", options: [{ id: "a", text: "console" }, { id: "b", text: "process" }, { id: "c", text: "document" }, { id: "d", text: "import" }], correct: "c", explanation: "window and document only exist in browsers, not in Node." },
        { id: "q3", prompt: "How do you run a file called hello.js from the terminal?", options: [{ id: "a", text: "node hello.js" }, { id: "b", text: "npm hello.js" }, { id: "c", text: "run hello.js" }, { id: "d", text: "open hello.js" }], correct: "a", explanation: "The node command reads the file, runs it, and prints output to the terminal." },
        { id: "q4", prompt: "What does adding \"type\": \"module\" to package.json do?", options: [{ id: "a", text: "Installs all dependencies" }, { id: "b", text: "Creates a new module folder" }, { id: "c", text: "Makes the project private" }, { id: "d", text: "Turns on the modern import/export syntax" }], correct: "d", explanation: "With \"type\": \"module\", Node treats your files as modules that use import and export." },
        { id: "q5", prompt: "What does npm install express do?", options: [{ id: "a", text: "Starts an Express server" }, { id: "b", text: "Adds Express as a dependency of your project" }, { id: "c", text: "Creates a new package.json" }, { id: "d", text: "Deletes the node_modules folder" }], correct: "b", explanation: "npm install downloads the package and lists it under dependencies in package.json." },
        { id: "q6", prompt: "If node_modules gets messed up, what should you do?", options: [{ id: "a", text: "Edit the broken files by hand" }, { id: "b", text: "Copy it from another project" }, { id: "c", text: "Delete it and run npm install" }, { id: "d", text: "Rename it to modules" }], correct: "c", explanation: "node_modules can always be rebuilt from package.json with npm install." },
        { id: "q7", prompt: "A script logs \"Start\", sets a 1-second timer that logs \"Timer\", then logs \"End\". What prints?", options: [{ id: "a", text: "Start, End, Timer" }, { id: "b", text: "Start, Timer, End" }, { id: "c", text: "Timer, Start, End" }, { id: "d", text: "Only Start and End" }], correct: "a", explanation: "The timer is handed off and the event loop runs its callback later, so the rest of the script keeps running first." },
      ],
    },
    {
      id: "files-and-servers",
      title: "Files and Servers",
      description: "Lessons 6–10: files, paths, environment variables, .env files, and your first HTTP server.",
      questions: [
        { id: "q1", prompt: "Why use the promise version of fs (node:fs/promises)?", options: [{ id: "a", text: "It only works on Windows" }, { id: "b", text: "It makes files smaller" }, { id: "c", text: "It encrypts files automatically" }, { id: "d", text: "You can use await without blocking other work" }], correct: "d", explanation: "The promise version lets you await file operations while Node keeps handling other work." },
        { id: "q2", prompt: "What does the node: prefix in \"node:fs/promises\" tell you?", options: [{ id: "a", text: "The module is built into Node" }, { id: "b", text: "The module comes from npm" }, { id: "c", text: "The module is experimental" }, { id: "d", text: "The module only runs in browsers" }], correct: "a", explanation: "The node: prefix marks a module that ships with Node rather than one installed from npm." },
        { id: "q3", prompt: "What is the best way to build a file path that works on every operating system?", options: [{ id: "a", text: "Glue strings together with + and \"/\"" }, { id: "b", text: "Always use backslashes" }, { id: "c", text: "Use path.join" }, { id: "d", text: "Use process.argv" }], correct: "c", explanation: "path.join builds paths with the right separators for whatever system your code runs on." },
        { id: "q4", prompt: "What does path.extname(\"photo.png\") return?", options: [{ id: "a", text: "\"photo\"" }, { id: "b", text: "\".png\"" }, { id: "c", text: "\"photo.png\"" }, { id: "d", text: "\"png/photo\"" }], correct: "b", explanation: "path.extname returns the file extension, including the dot." },
        { id: "q5", prompt: "Where should secrets like API keys be kept?", options: [{ id: "a", text: "Hard-coded in app.js" }, { id: "b", text: "In a comment at the top of the file" }, { id: "c", text: "In package.json" }, { id: "d", text: "In environment variables" }], correct: "d", explanation: "Environment variables keep secrets out of the code you commit to Git." },
        { id: "q6", prompt: "Which command starts app.js with the settings from a .env file loaded?", options: [{ id: "a", text: "node app.js .env" }, { id: "b", text: "node --env-file=.env app.js" }, { id: "c", text: "npm install .env" }, { id: "d", text: "node --watch .env" }], correct: "b", explanation: "The --env-file flag loads the file's values into process.env before your code runs." },
        { id: "q7", prompt: "Why should .env be listed in .gitignore?", options: [{ id: "a", text: "So your secrets never get pushed to GitHub" }, { id: "b", text: "So Node can find the file" }, { id: "c", text: "So npm installs it" }, { id: "d", text: "So the server starts faster" }], correct: "a", explanation: "Ignoring .env keeps secret values out of your Git history." },
        { id: "q8", prompt: "In http.createServer((req, res) => { ... }), what is res used for?", options: [{ id: "a", text: "Reading the request URL" }, { id: "b", text: "Restarting the server" }, { id: "c", text: "Sending a reply back to the client" }, { id: "d", text: "Choosing the port" }], correct: "c", explanation: "req describes the incoming request, and res is the object you use to send the response." },
      ],
    },
    {
      id: "express-apis",
      title: "Building with Express",
      description: "Lessons 11–16: Express routes, middleware, static files, JSON APIs, and error handling.",
      questions: [
        { id: "q1", prompt: "Why use Express instead of the plain http module?", options: [{ id: "a", text: "The http module can't run servers" }, { id: "b", text: "Express gives a clean way to answer different URLs" }, { id: "c", text: "Express runs in the browser" }, { id: "d", text: "Express doesn't need Node" }], correct: "b", explanation: "Routing many URLs by hand with http gets messy, and Express makes it clean." },
        { id: "q2", prompt: "For the route /courses/:slug, where do you read the slug value?", options: [{ id: "a", text: "req.query.slug" }, { id: "b", text: "req.body.slug" }, { id: "c", text: "res.params.slug" }, { id: "d", text: "req.params.slug" }], correct: "d", explanation: "Colon segments in the path become parameters on req.params." },
        { id: "q3", prompt: "For the URL /search?q=python, how do you read \"python\"?", options: [{ id: "a", text: "req.query.q" }, { id: "b", text: "req.params.q" }, { id: "c", text: "req.search" }, { id: "d", text: "process.argv.q" }], correct: "a", explanation: "req.query holds everything after the question mark." },
        { id: "q4", prompt: "What happens if your middleware forgets to call next()?", options: [{ id: "a", text: "Express calls it for you" }, { id: "b", text: "The server crashes" }, { id: "c", text: "The request hangs with no response" }, { id: "d", text: "The request skips to a 404" }], correct: "c", explanation: "Without next() or a response, the request is never finished." },
        { id: "q5", prompt: "With app.use(express.static(\"public\")), what URL serves public/style.css?", options: [{ id: "a", text: "/public/style.css" }, { id: "b", text: "/style.css" }, { id: "c", text: "/static/style.css" }, { id: "d", text: "/public" }], correct: "b", explanation: "The folder name isn't part of the URL, so files are served from the site root." },
        { id: "q6", prompt: "Which status code means a new resource was created?", options: [{ id: "a", text: "200" }, { id: "b", text: "400" }, { id: "c", text: "404" }, { id: "d", text: "201" }], correct: "d", explanation: "201 means created, which is what a successful POST that adds data returns." },
        { id: "q7", prompt: "Where should a catch-all 404 middleware go?", options: [{ id: "a", text: "After all your other routes" }, { id: "b", text: "Before express.json()" }, { id: "c", text: "Inside every route" }, { id: "d", text: "In package.json" }], correct: "a", explanation: "Express only reaches it when no earlier route matched the request." },
        { id: "q8", prompt: "How does Express recognize an error-handling middleware?", options: [{ id: "a", text: "It is named errorHandler" }, { id: "b", text: "It is added with app.error()" }, { id: "c", text: "It takes four arguments: err, req, res, next" }, { id: "d", text: "It always returns 500" }], correct: "c", explanation: "A middleware with four arguments is treated as an error handler." },
      ],
    },
  ],
};

export default introToNodejs;
