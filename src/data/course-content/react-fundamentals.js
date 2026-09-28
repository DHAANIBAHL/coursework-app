const reactFundamentals = {
  slug: "react-fundamentals",
  tag: "Frontend",
  title: "React Fundamentals",
  image: "",
  color: "bg-sky-600",
  description: "Components, props, state, and effects — everything you need to turn your JavaScript into real, interactive interfaces.",
  lessons: [
    {
      title: "What Is React?",
      body: "React is a JavaScript library for building user interfaces out of components. A component is just a function that returns what should appear on the screen, and its name must start with a capital letter.",
      code: `function Welcome() {
  return <h1>Welcome to Coursework</h1>;
}

export default function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}`,
      after: "Build small components and combine them, the same way you'd build a page from reusable pieces.",
    },
    {
      title: "JSX",
      body: "JSX lets you write HTML-like markup inside JavaScript. Curly braces {} drop any JavaScript expression into it, and a few attributes are renamed, like class becoming className.",
      code: `function Profile() {
  const name = "Asha";
  const courses = 3;

  return (
    <div className="profile">
      <h2>{name.toUpperCase()}</h2>
      <p>Enrolled in {courses} courses</p>
      <img src="/avatar.png" alt={name} />
    </div>
  );
}`,
      after: "A component returns one parent element, so wrap siblings in a <div> or an empty fragment <>...</>.",
    },
    {
      title: "Props",
      body: "Props are the inputs to a component, passed like HTML attributes. Strings go in quotes and any other value goes in curly braces, and the component receives them all as one object that you usually destructure.",
      code: `function CourseCard({ title, lessons }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{lessons} lessons</p>
    </div>
  );
}

function App() {
  return <CourseCard title="React Fundamentals" lessons={20} />;
}`,
      after: "Props are read-only, so a component should never change the props it receives.",
    },
    {
      title: "Composition and children",
      body: "Anything you put between a component's opening and closing tags arrives as a special prop called children. This lets you build wrapper components, like cards and layouts, that work with any content.",
      code: `function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

<Card title="Next up">
  <p>Lesson 5: Rendering Lists</p>
  <button>Start</button>
</Card>`,
      after: "Composing with children is usually simpler than adding more and more props to one component.",
    },
    {
      title: "Rendering Lists with Keys",
      body: "To show a list, map an array to JSX elements. Each item needs a key prop that is unique among its siblings so React can tell the items apart.",
      code: `const courses = [
  { id: 1, title: "HTML Basics" },
  { id: 2, title: "JavaScript Essentials" },
  { id: 3, title: "React Fundamentals" },
];

function CourseList() {
  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}`,
      after: "Use a stable id from your data as the key; the array index breaks when items are reordered or removed.",
    },
    {
      title: "Conditional Rendering",
      body: "Since JSX is just JavaScript, you choose what to show with normal conditions. Use the ternary operator to pick between two things, && to show something or nothing, and an early return to skip the rest.",
      code: `function Header({ user, unread }) {
  return (
    <header>
      {user ? <p>Hi, {user.name}</p> : <a href="/login">Log in</a>}
      {unread > 0 && <span>{unread} new</span>}
    </header>
  );
}

function Lesson({ locked }) {
  if (locked) return <p>This lesson is locked.</p>;
  return <p>Let's begin!</p>;
}`,
      after: "Watch out with &&: if the left side is 0, React renders the 0, so compare with > 0 instead.",
    },
    {
      title: "Handling Events",
      body: "React events are props like onClick and onChange that take a function. Pass the function itself, not the result of calling it.",
      code: `function LikeButton() {
  function handleClick() {
    alert("Thanks for the like!");
  }

  return <button onClick={handleClick}>Like</button>;
}

function DeleteButton({ id, onDelete }) {
  return <button onClick={() => onDelete(id)}>Delete</button>;
}`,
      after: "onClick={handleClick()} calls the function during render; wrap it in an arrow function when you need to pass arguments.",
    },
    {
      title: "State with useState",
      body: "State is data a component remembers between renders. useState returns the current value and a setter function, and calling the setter re-renders the component with the new value.",
      code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
      after: "When the next value depends on the previous one, the updater form setCount((c) => c + 1) is always safe.",
    },
    {
      title: "Updating Objects and Arrays in State",
      body: "Never change state objects or arrays directly, because React won't notice the change. Instead, make a new copy with spread, map, or filter and pass that to the setter.",
      code: `const [user, setUser] = useState({ name: "Asha", level: 1 });
const [todos, setTodos] = useState([]);

// Update one field of an object
setUser({ ...user, level: 2 });

// Add, remove, and update array items
setTodos([...todos, { id: Date.now(), text: "Learn React", done: false }]);
setTodos(todos.filter((t) => t.id !== id));
setTodos(todos.map((t) => (t.id === id ? { ...t, done: true } : t)));

// Wrong: user.level = 2; todos.push(item);`,
      after: "Avoid push, splice, and direct assignment on state; they change the original instead of making a new copy.",
    },
    {
      title: "Forms and Controlled Inputs",
      body: "A controlled input gets its value from state and updates that state on every change, so React always knows what's typed. On submit, call event.preventDefault() to stop the browser from reloading the page.",
      code: `function SignupForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Signing up", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
      after: "For checkboxes, read e.target.checked instead of e.target.value.",
    },
    {
      title: "Lifting State Up",
      body: "When two components need the same data, move the state up to their closest shared parent. The parent passes the value down as a prop, along with a function to change it.",
      code: `function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchBox query={query} onChange={setQuery} />
      <Results query={query} />
    </>
  );
}

function SearchBox({ query, onChange }) {
  return <input value={query} onChange={(e) => onChange(e.target.value)} />;
}`,
      after: "Data flows down through props, and changes flow back up through callback functions.",
    },
    {
      title: "Side Effects with useEffect",
      body: "useEffect runs code after React renders, for syncing with things outside React like timers, subscriptions, or the page title. The dependency array controls when it runs again, and the function you return cleans up.",
      code: `import { useEffect, useState } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds} seconds</p>;
}`,
      after: "An empty array [] runs once after the first render, [value] runs again whenever value changes, and no array runs after every render.",
    },
    {
      title: "Fetching Data",
      body: "A common pattern is to fetch data inside useEffect and store the result in state. Keep a loading state as well, so the user sees something while the request is in flight.",
      code: `function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      setUsers(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
      after: "The effect function itself can't be async, so define an async function inside it and call it.",
    },
    {
      title: "Refs with useRef",
      body: "useRef gives you a box whose .current value survives re-renders without causing one. Its most common use is reaching a DOM element directly, like focusing an input.",
      code: `import { useRef } from "react";

function SearchBar() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Search courses" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}`,
      after: "Use state for values shown on screen and a ref for values you just need to remember, like a timer id.",
    },
    {
      title: "Custom Hooks",
      body: "A custom hook is a function whose name starts with use and that calls other hooks, which lets you share stateful logic between components. Like all hooks, call it at the top level of a component, never inside a loop or condition.",
      code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const [theme, setTheme] = useLocalStorage("theme", "light");`,
      after: "Each component that calls a custom hook gets its own separate copy of the state.",
    },
    {
      title: "Sharing Data with Context",
      body: "Context lets a parent share a value with every component below it without passing props through each level. Create it with createContext, wrap the tree in its Provider, and read it anywhere with useContext.",
      code: `import { createContext, useContext } from "react";
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}`,
      after: "Save context for truly shared data like the logged-in user or theme; plain props are clearer for everything else.",
    },
    {
      title: "React Router Basics",
      body: "React Router maps URLs to components so a single-page app can have multiple pages. Route picks the component for each path, Link changes the page without a full reload, and useParams reads values from the URL.",
      code: `import { Routes, Route, Link, useParams } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course/:slug" element={<Course />} />
    </Routes>
  );
}

function Course() {
  const { slug } = useParams();
  return <Link to="/">Back from {slug}</Link>;
}`,
      after: "Wrap your app in <BrowserRouter> once, usually in main.jsx, so these components work.",
    },
    {
      title: "Styling Approaches",
      body: "The simplest way to style React is a regular CSS file plus className. You can also pass a style object for values that change, or use a utility framework like Tailwind CSS, which this app uses.",
      code: `import "./Card.css";

function Card({ done, progress }) {
  return (
    <div className={done ? "card card-done" : "card"}>
      <div style={{ width: \`\${progress}%\`, backgroundColor: "green" }} />
      <p className="text-sm font-bold text-sky-600">Progress: {progress}%</p>
    </div>
  );
}`,
      after: "Inline style objects use camelCase property names, like backgroundColor instead of background-color.",
    },
    {
      title: "Common Mistakes and Performance",
      body: "Most slow or buggy React code comes from a few habits: keeping values in state that could be calculated, using effects for things that aren't side effects, and mutating state. Once those are fixed, memo can skip re-rendering a component whose props haven't changed.",
      code: `import { memo } from "react";

// Wrong: extra state plus an effect to keep it in sync
const [fullName, setFullName] = useState("");
useEffect(() => setFullName(\`\${first} \${last}\`), [first, last]);

// Right: calculate it during render
const fullName = \`\${first} \${last}\`;

// Skip re-rendering when props haven't changed
const CourseCard = memo(function CourseCard({ title }) {
  return <h3>{title}</h3>;
});`,
      after: "Measure before optimizing; most components are fast enough without memo.",
    },
    {
      title: "Building and Deploying with Vite",
      body: "Vite gives you a fast dev server while you work and a production build when you're ready to ship. npm run build bundles and minifies your app into a dist folder of static files that any static host can serve.",
      code: `# Create a new React project
npm create vite@latest my-app -- --template react
cd my-app
npm install

npm run dev      # dev server with instant updates
npm run build    # optimized static files in dist/
npm run preview  # test the production build locally`,
      after: "Only environment variables starting with VITE_ are exposed to your code, through import.meta.env.",
    },
  ],
  quizzes: [
    {
      id: "components-and-jsx",
      title: "Components and JSX",
      description: "Lessons 1–7: components, JSX, props, children, lists, conditions, and events.",
      questions: [
        { id: "q1", prompt: "What must a React component's name start with?", options: [{ id: "a", text: "A lowercase letter" }, { id: "b", text: "A capital letter" }, { id: "c", text: 'The word "use"' }, { id: "d", text: "An underscore" }], correct: "b", explanation: "React treats capitalized tags as components and lowercase tags as plain HTML elements." },
        { id: "q2", prompt: "In JSX, which attribute replaces HTML's class?", options: [{ id: "a", text: "class" }, { id: "b", text: "cssClass" }, { id: "c", text: "styleName" }, { id: "d", text: "className" }], correct: "d", explanation: "class is a reserved word in JavaScript, so JSX uses className instead." },
        { id: "q3", prompt: "How do you pass the number 20 as a lessons prop?", options: [{ id: "a", text: "lessons={20}" }, { id: "b", text: 'lessons="20"' }, { id: "c", text: "lessons=20" }, { id: "d", text: "lessons:(20)" }], correct: "a", explanation: "Non-string values go in curly braces, while quotes would pass the text \"20\"." },
        { id: "q4", prompt: "What does the children prop contain?", options: [{ id: "a", text: "A list of every component in the app" }, { id: "b", text: "The component's state" }, { id: "c", text: "Whatever is placed between the component's opening and closing tags" }, { id: "d", text: "Only the text inside the component" }], correct: "c", explanation: "React passes anything nested inside a component's tags to it as children." },
        { id: "q5", prompt: "Why does each item rendered with map need a key prop?", options: [{ id: "a", text: "To style each item" }, { id: "b", text: "To make the list sortable" }, { id: "c", text: "Keys are only needed for tables" }, { id: "d", text: "So React can tell the items apart between renders" }], correct: "d", explanation: "A unique, stable key lets React track which item is which when the list changes." },
        { id: "q6", prompt: "If unread is 0, what does {unread && <span>new</span>} render?", options: [{ id: "a", text: "Nothing" }, { id: "b", text: "The number 0" }, { id: "c", text: 'The text "new"' }, { id: "d", text: "An error" }], correct: "b", explanation: "&& returns the left side when it's falsy, and React renders the number 0, so compare with > 0 instead." },
        { id: "q7", prompt: "Which line correctly runs handleClick when a button is clicked?", options: [{ id: "a", text: "onClick={handleClick()}" }, { id: "b", text: 'onClick="handleClick"' }, { id: "c", text: "onClick={handleClick}" }, { id: "d", text: "onclick={handleClick}" }], correct: "c", explanation: "Pass the function itself; adding () would call it during render instead of on click." },
      ],
    },
    {
      id: "state-and-effects",
      title: "State and Effects",
      description: "Lessons 8–14: state, forms, lifting state, effects, fetching data, and refs.",
      questions: [
        { id: "q1", prompt: "What does useState(0) return?", options: [{ id: "a", text: "The current value and a function to update it" }, { id: "b", text: "Just the number 0" }, { id: "c", text: "A ref object" }, { id: "d", text: "A promise" }], correct: "a", explanation: "useState returns a pair, usually destructured as const [count, setCount]." },
        { id: "q2", prompt: "What is the correct way to add item to a todos state array?", options: [{ id: "a", text: "todos.push(item)" }, { id: "b", text: "setTodos(todos.push(item))" }, { id: "c", text: "setTodos([...todos, item])" }, { id: "d", text: "todos = [...todos, item]" }], correct: "c", explanation: "Spreading into a new array gives React a fresh copy instead of mutating the old one." },
        { id: "q3", prompt: "What makes an input controlled?", options: [{ id: "a", text: "It has a name attribute" }, { id: "b", text: "It sits inside a form" }, { id: "c", text: "It uses a ref" }, { id: "d", text: "Its value comes from state and onChange updates that state" }], correct: "d", explanation: "A controlled input always shows the state value and reports every change back to it." },
        { id: "q4", prompt: "Why call event.preventDefault() in a form's onSubmit handler?", options: [{ id: "a", text: "To clear the inputs" }, { id: "b", text: "To stop the browser from reloading the page" }, { id: "c", text: "To send the form to the server" }, { id: "d", text: "To validate the email" }], correct: "b", explanation: "By default a form submit reloads the page, which would wipe out your app's state." },
        { id: "q5", prompt: "Two sibling components need the same state. Where should it live?", options: [{ id: "a", text: "In each sibling separately" }, { id: "b", text: "In localStorage" }, { id: "c", text: "In their closest shared parent" }, { id: "d", text: "In a global variable" }], correct: "c", explanation: "Lifting state to the shared parent lets it pass the value and a setter down to both." },
        { id: "q6", prompt: "When does a useEffect with an empty dependency array [] run?", options: [{ id: "a", text: "Once, after the first render" }, { id: "b", text: "After every render" }, { id: "c", text: "Before the component renders" }, { id: "d", text: "Only when the page is refreshed" }], correct: "a", explanation: "With no dependencies to watch, the effect never needs to run again after the first time." },
        { id: "q7", prompt: "Why define an async function inside useEffect instead of making the effect itself async?", options: [{ id: "a", text: "Async functions are slower" }, { id: "b", text: "The effect function itself can't be async" }, { id: "c", text: "fetch only works in named functions" }, { id: "d", text: "So the effect runs twice" }], correct: "b", explanation: "An effect may only return a cleanup function, but an async function always returns a promise." },
        { id: "q8", prompt: "What happens when you change a ref's .current value?", options: [{ id: "a", text: "The component re-renders" }, { id: "b", text: "The value resets on the next render" }, { id: "c", text: "It throws an error unless the ref holds a DOM element" }, { id: "d", text: "The value is kept, but no re-render happens" }], correct: "d", explanation: "Refs remember values between renders without triggering a re-render like state does." },
      ],
    },
    {
      id: "building-real-apps",
      title: "Building Real Apps",
      description: "Lessons 15–20: custom hooks, context, routing, styling, performance, and deployment.",
      questions: [
        { id: "q1", prompt: "What must a custom hook's name start with?", options: [{ id: "a", text: "get" }, { id: "b", text: "hook" }, { id: "c", text: "use" }, { id: "d", text: "A capital letter" }], correct: "c", explanation: "Starting with use tells React and your linter that the function follows the rules of hooks." },
        { id: "q2", prompt: "Where is it safe to call a hook?", options: [{ id: "a", text: "Inside a loop" }, { id: "b", text: "Inside an if statement" }, { id: "c", text: "Inside an event handler" }, { id: "d", text: "At the top level of a component or custom hook" }], correct: "d", explanation: "Hooks must be called in the same order on every render, so they belong at the top level." },
        { id: "q3", prompt: "Which hook reads the value provided by a context?", options: [{ id: "a", text: "useContext" }, { id: "b", text: "useState" }, { id: "c", text: "useRef" }, { id: "d", text: "createContext" }], correct: "a", explanation: "createContext makes the context, and useContext reads it from any component below the Provider." },
        { id: "q4", prompt: 'With the route path "/course/:slug", how does the Course component read slug?', options: [{ id: "a", text: "props.slug" }, { id: "b", text: "useParams()" }, { id: "c", text: "window.slug" }, { id: "d", text: "useContext(slug)" }], correct: "b", explanation: "useParams returns an object with each : segment of the path, so const { slug } = useParams()." },
        { id: "q5", prompt: "Why use React Router's Link instead of a plain <a> tag for pages in your app?", options: [{ id: "a", text: "Link comes with built-in styles" }, { id: "b", text: "Link is required for external websites" }, { id: "c", text: "Link changes the page without a full reload" }, { id: "d", text: "Link loads every page in advance" }], correct: "c", explanation: "Link updates the URL and swaps components in place, keeping your app's state." },
        { id: "q6", prompt: "How is background-color written in a React inline style object?", options: [{ id: "a", text: "background-color" }, { id: "b", text: "background_color" }, { id: "c", text: "BackgroundColor" }, { id: "d", text: "backgroundColor" }], correct: "d", explanation: "Style objects use camelCase property names." },
        { id: "q7", prompt: "fullName is always first + \" \" + last. What's the best way to get it?", options: [{ id: "a", text: "Calculate it during render" }, { id: "b", text: "Store it in state and sync it with useEffect" }, { id: "c", text: "Keep it in a ref" }, { id: "d", text: "Put it in context" }], correct: "a", explanation: "Values you can compute from existing props or state don't need their own state or an effect." },
        { id: "q8", prompt: "What does npm run build produce in a Vite project?", options: [{ id: "a", text: "A running dev server" }, { id: "b", text: "Optimized static files in a dist folder" }, { id: "c", text: "A new React project" }, { id: "d", text: "A database for your app" }], correct: "b", explanation: "The build bundles and minifies your app into static files any static host can serve." },
      ],
    },
  ],
};

export default reactFundamentals;
