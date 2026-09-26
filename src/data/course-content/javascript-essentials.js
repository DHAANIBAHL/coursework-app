const javascriptEssentials = {
  slug: "javascript-essentials",
  tag: "Programming",
  title: "JavaScript Essentials",
  image: "/images/JavaScript.png",
  color: "bg-blue-600",
  description: "Variables, functions, the DOM, and how to handle things that take time — the core of writing real JavaScript.",
  lessons: [
    {
      title: "Variables with let and const",
      body: "Variables store values so you can use them later. Use const for values that won't be reassigned and let for values that will change.",
      code: `const siteName = "Coursework";
let score = 0;

score = score + 10;
console.log(siteName, score); // Coursework 10`,
      after: "Default to const. Switch to let only when you actually need to reassign.",
    },
    {
      title: "Data Types",
      body: "JavaScript has a few core types: strings for text, numbers, booleans for true or false, and null or undefined for missing values. typeof tells you what you're working with.",
      code: `const name = "Asha";      // string
const age = 21;           // number
const isStudent = true;   // boolean
let nickname;             // undefined

console.log(typeof age);  // "number"`,
      after: "undefined means nothing was assigned yet; null means you deliberately set it to empty.",
    },
    {
      title: "Strings and Template Literals",
      body: "Template literals use backticks and let you drop variables straight into text with ${}. They're easier to read than joining strings with +.",
      code: `const course = "JavaScript";
const lessons = 12;

const message = \`\${course} has \${lessons} lessons.\`;
console.log(message);

console.log(course.toUpperCase()); // "JAVASCRIPT"
console.log(course.length);        // 10`,
      after: "Strings also come with handy methods like .includes(), .trim(), and .split().",
    },
    {
      title: "Operators and Truthy/Falsy Values",
      body: "Arithmetic operators do math, and the logical operators &&, ||, and ! combine true and false values. Every value is also truthy or falsy: 0, \"\", null, undefined, NaN, and false are falsy, and everything else is truthy.",
      code: `const price = 20;
const qty = 3;
console.log(price * qty); // 60
console.log(10 % 3);      // 1 (the remainder)

const isMember = true;
const hasCoupon = false;
console.log(isMember && hasCoupon); // false
console.log(isMember || hasCoupon); // true
console.log(!isMember);             // false

const username = "";
console.log(username || "Guest");   // "Guest"`,
      after: "|| is a quick way to fall back to a default when a value is empty.",
    },
    {
      title: "Comparisons and Conditionals",
      body: "if statements run code only when a condition is true. Use === to compare values, because == converts types first and can give surprising results.",
      code: `const score = 72;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 60) {
  console.log("Passed");
} else {
  console.log("Try again");
}

console.log(5 === "5"); // false
console.log(5 == "5");  // true (avoid this)`,
      after: "Conditions are checked top to bottom, and only the first matching branch runs.",
    },
    {
      title: "Switch and the Ternary Operator",
      body: "The ternary operator condition ? a : b picks between two values in a single line. A switch statement compares one value against several cases, which reads more cleanly than a long chain of else ifs.",
      code: `const score = 72;
const result = score >= 60 ? "Pass" : "Fail";
console.log(result); // "Pass"

const day = "sat";

switch (day) {
  case "sat":
  case "sun":
    console.log("Weekend");
    break;
  default:
    console.log("Weekday");
}`,
      after: "Don't forget break in a switch, or the code falls through into the next case.",
    },
    {
      title: "Functions",
      body: "A function is a reusable block of code. It can take inputs, called parameters, and send back a result with return.",
      code: `function add(a, b) {
  return a + b;
}

// The same thing as an arrow function
const multiply = (a, b) => a * b;

console.log(add(2, 3));      // 5
console.log(multiply(4, 5)); // 20`,
      after: "Arrow functions are shorter and very common in React code.",
    },
    {
      title: "Scope and Closures",
      body: "Variables declared with let and const only exist inside the block or function where they're created. A closure is a function that remembers the variables from where it was made, even after the outer function has finished.",
      code: `function makeCounter() {
  let count = 0;

  return () => {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// console.log(count);  // Error: count is not defined`,
      after: "Closures let you keep private state that only the returned function can change.",
    },
    {
      title: "Arrays",
      body: "An array holds an ordered list of values. Items are counted from index 0, and methods like push add to the list.",
      code: `const courses = ["HTML", "CSS", "JavaScript"];

console.log(courses[0]);      // "HTML"
console.log(courses.length);  // 3

courses.push("React");
console.log(courses.includes("CSS")); // true`,
      after: "Arrays can hold any type, including objects and other arrays.",
    },
    {
      title: "Objects",
      body: "Objects group related values under named keys. You read and update them with dot notation.",
      code: `const student = {
  name: "Ravi",
  age: 20,
  courses: ["HTML", "CSS"],
};

console.log(student.name);   // "Ravi"
student.age = 21;
student.city = "Hyderabad";  // adds a new key`,
      after: "The course data in this very app is an array of objects.",
    },
    {
      title: "Destructuring",
      body: "Destructuring pulls values out of objects and arrays into their own variables in one step. Objects are unpacked by key name, and arrays are unpacked by position.",
      code: `const student = { name: "Ravi", age: 20, city: "Hyderabad" };
const { name, city } = student;
console.log(name, city); // Ravi Hyderabad

const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log(first, second); // red green

function greet({ name }) {
  return \`Hi, \${name}!\`;
}
console.log(greet(student)); // "Hi, Ravi!"`,
      after: "You'll see destructuring constantly in React, like const [count, setCount] = useState(0).",
    },
    {
      title: "Spread and Rest",
      body: "The spread operator ... expands an array or object into its individual pieces, which is handy for copying and merging. In a function's parameters, the same ... is called rest and gathers leftover arguments into an array.",
      code: `const base = ["HTML", "CSS"];
const all = [...base, "JavaScript"];
console.log(all); // ["HTML", "CSS", "JavaScript"]

const user = { name: "Asha", age: 21 };
const updated = { ...user, age: 22 };
console.log(updated); // { name: "Asha", age: 22 }

function logAll(first, ...rest) {
  console.log(first, rest);
}
logAll(1, 2, 3); // 1 [2, 3]`,
      after: "Spreading into a new array or object makes a copy, so the original stays unchanged.",
    },
    {
      title: "Loops and Array Methods",
      body: "Loops repeat code. For arrays, methods like map, filter, and forEach are usually clearer than a classic for loop.",
      code: `const scores = [45, 80, 92, 60];

for (const s of scores) {
  console.log(s);
}

const passed = scores.filter((s) => s >= 60);
const doubled = scores.map((s) => s * 2);

console.log(passed);  // [80, 92, 60]
console.log(doubled); // [90, 160, 184, 120]`,
      after: "map returns a new array of the same length; filter returns only the items that pass the test.",
    },
    {
      title: "find, reduce, and sort",
      body: "find returns the first item that passes a test, reduce boils an array down to a single value, and sort puts items in order.",
      code: `const scores = [45, 80, 92, 60];

const firstPass = scores.find((s) => s >= 60);
console.log(firstPass); // 80

const total = scores.reduce((sum, s) => sum + s, 0);
console.log(total);     // 277

const sorted = [...scores].sort((a, b) => a - b);
console.log(sorted);    // [45, 60, 80, 92]`,
      after: "sort changes the original array and compares items as text by default, so copy it first and pass (a, b) => a - b for numbers.",
    },
    {
      title: "Error Handling with try/catch",
      body: "When something goes wrong, you can throw an error to stop the current code. try/catch lets you catch that error and respond, and finally runs whether or not anything failed.",
      code: `function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error) {
  console.log(error.message); // "Cannot divide by zero"
} finally {
  console.log("Done");
}`,
      after: "Throw errors with clear messages so problems are easy to spot and fix.",
    },
    {
      title: "Selecting and Changing the DOM",
      body: "The DOM is the browser's live version of your HTML. JavaScript can find elements and change their text, styles, and classes.",
      code: `const title = document.querySelector("h1");
title.textContent = "Welcome back!";

const card = document.querySelector(".card");
card.classList.add("highlight");

const items = document.querySelectorAll("li");
console.log(items.length);`,
      after: "querySelector returns the first match; querySelectorAll returns all of them.",
    },
    {
      title: "Handling Events",
      body: "Events are things that happen on the page, like clicks and key presses. addEventListener runs a function each time the event fires.",
      code: `const button = document.querySelector("#like");
let likes = 0;

button.addEventListener("click", () => {
  likes++;
  button.textContent = \`Likes: \${likes}\`;
});`,
      after: "This is the same idea React's onClick uses, just written by hand.",
    },
    {
      title: "Callbacks and Timers",
      body: "Some code doesn't run right away. setTimeout schedules a function to run later, and JavaScript keeps going in the meantime instead of waiting.",
      code: `console.log("First");

setTimeout(() => {
  console.log("Runs after 2 seconds");
}, 2000);

console.log("Second");
// Output: First, Second, Runs after 2 seconds`,
      after: "The function passed to setTimeout is called a callback — it gets called back once the wait is over.",
    },
    {
      title: "Promises and async/await",
      body: "A promise represents a value that will arrive later, like data from a server. async and await let you write that waiting code as if it ran top to bottom.",
      code: `async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    console.log(users[0].name);
  } catch (error) {
    console.error("Could not load users:", error);
  }
}

loadUsers();`,
      after: "Wrap await calls in try/catch so a failed request doesn't crash your code.",
    },
    {
      title: "JSON and localStorage",
      body: "JSON is a text format for data that looks like JavaScript objects, and it's what most APIs send back. localStorage saves strings in the browser so they survive a page refresh, so you convert objects with JSON.stringify and read them back with JSON.parse.",
      code: `const settings = { theme: "dark", fontSize: 16 };

const text = JSON.stringify(settings);
console.log(text); // '{"theme":"dark","fontSize":16}'

localStorage.setItem("settings", text);

const saved = JSON.parse(localStorage.getItem("settings"));
console.log(saved.theme); // "dark"`,
      after: "localStorage only stores strings, so always stringify objects before saving and parse them after loading.",
    },
  ],
  quizzes: [
    {
      id: "the-basics",
      title: "The Basics",
      description: "Lessons 1–7: variables, types, strings, operators, conditionals, and functions.",
      questions: [
        { id: "q1", prompt: "Which keyword should you use for a variable that will never be reassigned?", options: [{ id: "a", text: "let" }, { id: "b", text: "var" }, { id: "c", text: "const" }, { id: "d", text: "static" }], correct: "c", explanation: "const declares a variable that can't be reassigned, so default to it and use let only when the value needs to change." },
        { id: "q2", prompt: "What does typeof 21 return?", options: [{ id: "a", text: '"number"' }, { id: "b", text: '"string"' }, { id: "c", text: '"boolean"' }, { id: "d", text: '"undefined"' }], correct: "a", explanation: "21 is a number, so typeof reports \"number\"." },
        { id: "q3", prompt: "What do template literals use to wrap their text?", options: [{ id: "a", text: "Single quotes" }, { id: "b", text: "Double quotes" }, { id: "c", text: "Parentheses" }, { id: "d", text: "Backticks" }], correct: "d", explanation: "Template literals are wrapped in backticks, which lets you insert values with ${}." },
        { id: "q4", prompt: 'What does 5 === "5" evaluate to?', options: [{ id: "a", text: "true" }, { id: "b", text: "false" }, { id: "c", text: "undefined" }, { id: "d", text: "It throws an error" }], correct: "b", explanation: "=== compares both value and type without converting, and a number is not a string." },
        { id: "q5", prompt: "Which of these values is falsy?", options: [{ id: "a", text: '"0"' }, { id: "b", text: '"hello"' }, { id: "c", text: "[]" }, { id: "d", text: "0" }], correct: "d", explanation: "The number 0 is falsy, while any non-empty string and any array are truthy." },
        { id: "q6", prompt: 'If score is 72, what does score >= 60 ? "Pass" : "Fail" give you?', options: [{ id: "a", text: '"Pass"' }, { id: "b", text: '"Fail"' }, { id: "c", text: "true" }, { id: "d", text: "72" }], correct: "a", explanation: "The condition is true, so the ternary returns the value before the colon." },
        { id: "q7", prompt: "Which keyword does a function use to send a result back to the caller?", options: [{ id: "a", text: "output" }, { id: "b", text: "return" }, { id: "c", text: "send" }, { id: "d", text: "break" }], correct: "b", explanation: "return ends the function and hands its value back to whoever called it." },
      ],
    },
    {
      id: "working-with-data",
      title: "Working with Data",
      description: "Lessons 8–14: scope, arrays, objects, destructuring, spread, and array methods.",
      questions: [
        { id: "q1", prompt: "With const counter = makeCounter() from the closures lesson, what does the second call to counter() return?", options: [{ id: "a", text: "0" }, { id: "b", text: "1" }, { id: "c", text: "2" }, { id: "d", text: "An error" }], correct: "c", explanation: "The returned function remembers count between calls, so it goes 1 and then 2." },
        { id: "q2", prompt: "Given const courses = [\"HTML\", \"CSS\", \"JavaScript\"], what is courses[1]?", options: [{ id: "a", text: '"HTML"' }, { id: "b", text: '"CSS"' }, { id: "c", text: '"JavaScript"' }, { id: "d", text: "undefined" }], correct: "b", explanation: "Arrays count from index 0, so index 1 is the second item." },
        { id: "q3", prompt: "How do you add a new city key to an existing student object?", options: [{ id: "a", text: 'student.city = "Hyderabad"' }, { id: "b", text: 'student.push("Hyderabad")' }, { id: "c", text: 'student.add("city")' }, { id: "d", text: "You can't add keys after an object is created" }], correct: "a", explanation: "Assigning to a new key with dot notation adds it to the object." },
        { id: "q4", prompt: 'After const [first, second] = ["red", "green", "blue"], what is second?', options: [{ id: "a", text: '"red"' }, { id: "b", text: '"blue"' }, { id: "c", text: "undefined" }, { id: "d", text: '"green"' }], correct: "d", explanation: "Array destructuring unpacks by position, so second gets the item at index 1." },
        { id: "q5", prompt: 'If user is { name: "Asha", age: 21 }, what is { ...user, age: 22 }?', options: [{ id: "a", text: '{ name: "Asha", age: 21 }' }, { id: "b", text: '{ name: "Asha", age: 22 }' }, { id: "c", text: "{ age: 22 }" }, { id: "d", text: "It throws an error" }], correct: "b", explanation: "Spread copies every key, and the later age: 22 overrides the copied value." },
        { id: "q6", prompt: "What does [45, 80, 92].filter((s) => s >= 60) return?", options: [{ id: "a", text: "[80, 92]" }, { id: "b", text: "[45]" }, { id: "c", text: "[true, true, false]" }, { id: "d", text: "2" }], correct: "a", explanation: "filter returns a new array containing only the items that pass the test." },
        { id: "q7", prompt: "What does [1, 2, 3].reduce((sum, n) => sum + n, 0) return?", options: [{ id: "a", text: "0" }, { id: "b", text: "[1, 2, 3]" }, { id: "c", text: "6" }, { id: "d", text: "3" }], correct: "c", explanation: "reduce starts at 0 and adds each number in turn, ending with 6." },
        { id: "q8", prompt: "What does [45, 80, 92].find((s) => s >= 60) return?", options: [{ id: "a", text: "[80, 92]" }, { id: "b", text: "true" }, { id: "c", text: "1" }, { id: "d", text: "80" }], correct: "d", explanation: "find returns the first item that passes the test, not an array of all matches." },
      ],
    },
    {
      id: "browser-and-async",
      title: "Browser and Async",
      description: "Lessons 15–20: errors, the DOM, events, async code, and saving data.",
      questions: [
        { id: "q1", prompt: "When does a finally block run?", options: [{ id: "a", text: "Only when no error was thrown" }, { id: "b", text: "Only when an error was caught" }, { id: "c", text: "Every time, whether or not an error was thrown" }, { id: "d", text: "Only if you call it by name" }], correct: "c", explanation: "finally always runs after try and catch, which makes it good for cleanup." },
        { id: "q2", prompt: "What is the difference between querySelector and querySelectorAll?", options: [{ id: "a", text: "querySelector only works with IDs" }, { id: "b", text: "querySelector returns the first match; querySelectorAll returns every match" }, { id: "c", text: "querySelectorAll is faster" }, { id: "d", text: "There is no difference" }], correct: "b", explanation: "querySelector stops at the first matching element, while querySelectorAll returns all of them." },
        { id: "q3", prompt: "Which method runs a function every time a button is clicked?", options: [{ id: "a", text: "addEventListener" }, { id: "b", text: "setTimeout" }, { id: "c", text: "querySelector" }, { id: "d", text: "classList.add" }], correct: "a", explanation: "addEventListener attaches a function that runs each time the event fires." },
        { id: "q4", prompt: 'In what order does this log? console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");', options: [{ id: "a", text: "A, B, C" }, { id: "b", text: "B, A, C" }, { id: "c", text: "C, B, A" }, { id: "d", text: "A, C, B" }], correct: "d", explanation: "setTimeout schedules its callback for later, even with a 0ms delay, so the rest of the code runs first." },
        { id: "q5", prompt: "Why wrap await calls in try/catch?", options: [{ id: "a", text: "So a failed request is handled instead of crashing your code" }, { id: "b", text: "To make the request faster" }, { id: "c", text: "It's required for await to work" }, { id: "d", text: "To convert the response to JSON" }], correct: "a", explanation: "If the awaited promise rejects, catch lets you handle the error gracefully." },
        { id: "q6", prompt: "What does JSON.stringify do?", options: [{ id: "a", text: "Turns JSON text back into an object" }, { id: "b", text: "Turns an object into a JSON string" }, { id: "c", text: "Saves data to localStorage" }, { id: "d", text: "Fetches data from a server" }], correct: "b", explanation: "JSON.stringify converts a value into JSON text, and JSON.parse does the reverse." },
        { id: "q7", prompt: "What kind of values can localStorage store?", options: [{ id: "a", text: "Any object directly" }, { id: "b", text: "Only numbers" }, { id: "c", text: "Functions and objects" }, { id: "d", text: "Only strings" }], correct: "d", explanation: "localStorage only stores strings, so objects must be stringified before saving." },
      ],
    },
  ],
};

export default javascriptEssentials;
