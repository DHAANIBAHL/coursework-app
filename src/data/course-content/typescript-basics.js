const typescriptBasics = {
  slug: "typescript-basics",
  tag: "Programming",
  title: "TypeScript Basics",
  image: "",
  color: "bg-blue-700",
  description: "Types, interfaces, generics, and typed React props — the JavaScript you already know, with mistakes caught before you run it.",
  lessons: [
    {
      title: "Why TypeScript and Setting Up",
      body: "TypeScript is JavaScript with types added on top. The compiler, tsc, checks your code for mistakes and then turns it into plain JavaScript that browsers can run.",
      code: `// greet.ts
function greet(name: string) {
  return "Hello, " + name;
}

greet("Asha"); // fine
greet(42);     // Error: number is not assignable to string

// In the terminal:
// npm install --save-dev typescript
// npx tsc --init   (creates tsconfig.json)
// npx tsc          (checks and compiles your .ts files)`,
      after: "tsconfig.json holds the compiler settings, and turning on \"strict\": true gives you the most useful checks.",
    },
    {
      title: "Basic Type Annotations",
      body: "A type annotation is a colon followed by a type, written after a variable or parameter name. The basic types match JavaScript's: string, number, and boolean.",
      code: `let course: string = "TypeScript";
let lessons: number = 16;
let isPublished: boolean = true;

lessons = 20;        // fine
lessons = "twenty";  // Error: string is not assignable to number

let nickname: string | undefined;
console.log(nickname); // undefined`,
      after: "Once a variable has a type, TypeScript won't let you put a different kind of value in it.",
    },
    {
      title: "Type Inference",
      body: "You don't have to annotate everything. When you assign a value right away, TypeScript works out the type for you from that value.",
      code: `let score = 0;          // inferred as number
const title = "Intro";  // inferred as the literal "Intro"

score = 10;      // fine
score = "ten";   // Error: string is not assignable to number

const scores = [45, 80, 92];  // inferred as number[]
const total = scores.length;  // inferred as number`,
      after: "Let inference handle local variables and save annotations for function parameters and places where the type isn't obvious.",
    },
    {
      title: "Arrays and Tuples",
      body: "An array type is written as the item type followed by [], like string[]. A tuple is an array with a fixed length where each position has its own type.",
      code: `const courses: string[] = ["HTML", "CSS"];
courses.push("React");  // fine
courses.push(42);       // Error: number is not assignable to string

const ids: Array<number> = [1, 2, 3]; // same as number[]

const point: [number, number] = [10, 20];
const entry: [string, number] = ["Ravi", 21];

const [name, age] = entry; // name is string, age is number`,
      after: "Use a tuple when position matters, like a pair of coordinates or the [value, setValue] pair from useState.",
    },
    {
      title: "Object Types",
      body: "An object type lists each key and the type of its value. TypeScript then checks that objects have exactly those keys with the right kinds of values.",
      code: `const student: { name: string; age: number } = {
  name: "Ravi",
  age: 20,
};

student.age = 21;       // fine
student.age = "21";     // Error: string is not assignable to number
student.city = "Pune";  // Error: city does not exist on this type

function describe(s: { name: string; age: number }) {
  return s.name + " is " + s.age;
}`,
      after: "Writing the same object type twice gets repetitive, which is exactly what the next lesson fixes.",
    },
    {
      title: "Type Aliases and Interfaces",
      body: "A type alias gives any type a name with the type keyword. An interface also names an object type, and it can be extended with extends.",
      code: `type Student = {
  name: string;
  age: number;
};

interface Course {
  title: string;
  lessons: number;
}

interface VideoCourse extends Course {
  hours: number;
}
const ravi: Student = { name: "Ravi", age: 20 };
const ts: VideoCourse = { title: "TS", lessons: 16, hours: 4 };`,
      after: "Both work for object shapes, so pick one style per project; type is required for things like unions.",
    },
    {
      title: "Optional and Readonly Properties",
      body: "A ? after a property name makes it optional, so objects can leave it out. readonly stops a property from being changed after the object is created.",
      code: `interface User {
  readonly id: number;
  name: string;
  email?: string;
}

const asha: User = { id: 1, name: "Asha" }; // email can be left out

asha.name = "Asha B.";  // fine
asha.id = 2;            // Error: id is read-only

console.log(asha.email); // undefined`,
      after: "An optional property might be undefined, so check it before using it.",
    },
    {
      title: "Union Types and Narrowing",
      body: "A union type, written with |, means a value can be one of several types. Before using it, you narrow it with a check like typeof so TypeScript knows which type you have.",
      code: `function formatId(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase(); // id is a string here
  }
  return id.toFixed(0);      // id is a number here
}

console.log(formatId("ab12")); // "AB12"
console.log(formatId(42));     // "42"

let result: string | null = null;
result = "done";`,
      after: "TypeScript follows your if checks, so inside each branch you can use that type's methods safely.",
    },
    {
      title: "Literal Types",
      body: "A literal type is one exact value, like \"small\" or 42, used as a type. Combining literals in a union limits a value to a short list of allowed options.",
      code: `type Size = "small" | "medium" | "large";

let buttonSize: Size = "medium";
buttonSize = "large";  // fine
buttonSize = "huge";   // Error: "huge" is not assignable to Size

function move(direction: "up" | "down") {
  console.log("Moving", direction);
}

move("up");    // fine
move("left");  // Error`,
      after: "Literal unions catch typos in strings that would otherwise fail silently.",
    },
    {
      title: "Typing Functions",
      body: "Function parameters get annotations just like variables, and the return type goes after the parentheses. Add ? to a parameter to make it optional, or give it a default value.",
      code: `function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string, greeting?: string): string {
  return (greeting ?? "Hello") + ", " + name;
}

const multiply = (a: number, b: number): number => a * b;
function log(message: string): void {
  console.log(message);
}

greet("Asha");        // "Hello, Asha"
greet("Asha", "Hi");  // "Hi, Asha"`,
      after: "void means a function doesn't return anything useful.",
    },
    {
      title: "any vs unknown",
      body: "any turns off type checking for a value, so TypeScript lets you do anything with it. unknown also accepts any value, but makes you check its type before you can use it.",
      code: `let a: any = "hello";
a.toFixed(); // no error, but crashes when it runs

let u: unknown = "hello";
u.toUpperCase(); // Error: u is of type unknown

if (typeof u === "string") {
  console.log(u.toUpperCase()); // fine after the check
}

const data: unknown = JSON.parse('{"name":"Ravi"}');`,
      after: "Reach for unknown when you don't know a value's type yet, and avoid any wherever you can.",
    },
    {
      title: "Generics",
      body: "Generics let a function or type work with many types while keeping track of which one you used. The type parameter, usually written <T>, is filled in when the function is called.",
      code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([10, 20, 30]);   // n is number | undefined
const s = first(["a", "b"]);     // s is string | undefined

interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const nameBox: Box<string> = { value: "Asha" };`,
      after: "You've already used generics: Array<number> and Promise<string> are both generic types.",
    },
    {
      title: "Utility Types",
      body: "TypeScript includes built-in utility types that make new types from existing ones. Partial makes every property optional, Pick keeps only some keys, Omit removes some keys, and Record builds an object type from key and value types.",
      code: `interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = Partial<User>;         // every key optional
type UserPreview = Pick<User, "name">;   // { name: string }
type NewUser = Omit<User, "id">;         // { name; email }

const scores: Record<string, number> = {
  asha: 92,
  ravi: 80,
};
const patch: UserUpdate = { email: "asha@example.com" };`,
      after: "Build related types from one main type so they stay in sync when it changes.",
    },
    {
      title: "Enums and as const",
      body: "An enum defines a named set of constant values. Many projects instead use a plain object with as const, which makes its values readonly literal types without any extra JavaScript.",
      code: `enum Level {
  Beginner,
  Intermediate,
  Advanced,
}
const myLevel: Level = Level.Beginner;

const Status = {
  Draft: "draft",
  Published: "published",
} as const;

type StatusValue = (typeof Status)[keyof typeof Status];
// "draft" | "published"
const current: StatusValue = Status.Published;`,
      after: "For a simple list of options, a literal union or an as const object is often all you need.",
    },
    {
      title: "Typing Async Code",
      body: "An async function always returns a Promise, and its return type is written as Promise<T>, where T is the value it resolves to. When you await the result, you get a plain T back.",
      code: `interface User {
  id: number;
  name: string;
}

async function loadUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

async function showName() {
  const user = await loadUser(1); // user is User
  console.log(user.name);
}`,
      after: "TypeScript can't check what a server really sends, so the type you give response.json() is a promise you're making.",
    },
    {
      title: "TypeScript with React Props",
      body: "In a React component written in a .tsx file, you describe its props with an interface or type. TypeScript then checks every place the component is used and flags missing or wrong props.",
      code: `interface CourseCardProps {
  title: string;
  lessons: number;
  onOpen?: () => void;
}
function CourseCard({ title, lessons, onOpen }: CourseCardProps) {
  return (
    <button onClick={onOpen}>
      {title} · {lessons} lessons
    </button>
  );
}

<CourseCard title="TypeScript" lessons={16} />;  // fine
<CourseCard title="TypeScript" />;               // Error: lessons is missing`,
      after: "Typed props act as built-in documentation, and your editor will autocomplete them as you type.",
    },
  ],
  quizzes: [
    {
      id: "types-and-shapes",
      title: "Types and Shapes",
      description: "Lessons 1–5: setup, annotations, inference, arrays, tuples, and object types.",
      questions: [
        { id: "q1", prompt: "What does the TypeScript compiler, tsc, do?", options: [{ id: "a", text: "Runs TypeScript directly in the browser" }, { id: "b", text: "Checks your code for type errors and compiles it to JavaScript" }, { id: "c", text: "Installs npm packages" }, { id: "d", text: "Formats your code" }], correct: "b", explanation: "tsc checks the types and then outputs plain JavaScript that browsers can run." },
        { id: "q2", prompt: "Which file holds the TypeScript compiler settings?", options: [{ id: "a", text: "package.json" }, { id: "b", text: "index.ts" }, { id: "c", text: "tsconfig.json" }, { id: "d", text: ".env" }], correct: "c", explanation: "tsconfig.json, created by npx tsc --init, holds the compiler options." },
        { id: "q3", prompt: "After let lessons: number = 16, what happens with lessons = \"twenty\"?", options: [{ id: "a", text: "TypeScript reports an error" }, { id: "b", text: "lessons becomes a string" }, { id: "c", text: "It is converted to the number 20" }, { id: "d", text: "Nothing, annotations are ignored" }], correct: "a", explanation: "A variable annotated as number can't be given a string." },
        { id: "q4", prompt: "What type does TypeScript infer for let score = 0?", options: [{ id: "a", text: "any" }, { id: "b", text: "unknown" }, { id: "c", text: "string" }, { id: "d", text: "number" }], correct: "d", explanation: "TypeScript infers the type from the assigned value, and 0 is a number." },
        { id: "q5", prompt: "Which type describes a pair like [\"Ravi\", 21] with a fixed order?", options: [{ id: "a", text: "string[]" }, { id: "b", text: "[string, number]" }, { id: "c", text: "Array<string>" }, { id: "d", text: "{ string; number }" }], correct: "b", explanation: "A tuple type gives each position its own type and fixes the length." },
        { id: "q6", prompt: "Given const student: { name: string; age: number }, what does student.city = \"Pune\" do?", options: [{ id: "a", text: "Adds a city key" }, { id: "b", text: "Replaces the name key" }, { id: "c", text: "Causes an error because city isn't in the type" }, { id: "d", text: "Sets city to undefined" }], correct: "c", explanation: "Object types list the allowed keys, so adding an unlisted key is an error." },
      ],
    },
    {
      id: "types-in-practice",
      title: "Types in Practice",
      description: "Lessons 6–11: aliases, interfaces, unions, literals, functions, and unknown.",
      questions: [
        { id: "q1", prompt: "Which keyword lets one interface build on another?", options: [{ id: "a", text: "implements" }, { id: "b", text: "type" }, { id: "c", text: "import" }, { id: "d", text: "extends" }], correct: "d", explanation: "interface VideoCourse extends Course adds new properties on top of Course's." },
        { id: "q2", prompt: "What does the ? in email?: string mean?", options: [{ id: "a", text: "The property can be left out" }, { id: "b", text: "The property can't be changed" }, { id: "c", text: "The property can be any type" }, { id: "d", text: "The property is required" }], correct: "a", explanation: "A ? makes a property optional, so it may be missing or undefined." },
        { id: "q3", prompt: "What happens if you assign to a readonly property after creating the object?", options: [{ id: "a", text: "The value changes normally" }, { id: "b", text: "TypeScript reports an error" }, { id: "c", text: "The property is deleted" }, { id: "d", text: "It becomes optional" }], correct: "b", explanation: "readonly properties can only be set when the object is created." },
        { id: "q4", prompt: "Inside if (typeof id === \"string\") where id is string | number, what type is id?", options: [{ id: "a", text: "string | number" }, { id: "b", text: "number" }, { id: "c", text: "string" }, { id: "d", text: "unknown" }], correct: "c", explanation: "The typeof check narrows the union, so inside that branch id is a string." },
        { id: "q5", prompt: "With type Size = \"small\" | \"medium\" | \"large\", which assignment is an error?", options: [{ id: "a", text: "const s: Size = \"huge\"" }, { id: "b", text: "const s: Size = \"small\"" }, { id: "c", text: "const s: Size = \"large\"" }, { id: "d", text: "const s: Size = \"medium\"" }], correct: "a", explanation: "A literal union only allows the exact values it lists." },
        { id: "q6", prompt: "What does a return type of void mean?", options: [{ id: "a", text: "The function returns undefined as a string" }, { id: "b", text: "The function can return any type" }, { id: "c", text: "The function must throw an error" }, { id: "d", text: "The function doesn't return anything useful" }], correct: "d", explanation: "void marks functions like loggers that are called for their effect, not a result." },
        { id: "q7", prompt: "How is unknown different from any?", options: [{ id: "a", text: "unknown only accepts strings" }, { id: "b", text: "unknown makes you check the type before using the value" }, { id: "c", text: "unknown turns off all type checking" }, { id: "d", text: "There is no difference" }], correct: "b", explanation: "Both accept any value, but unknown requires a check like typeof before you use it." },
      ],
    },
    {
      id: "advanced-and-react",
      title: "Advanced and React",
      description: "Lessons 12–16: generics, utility types, enums, async code, and React props.",
      questions: [
        { id: "q1", prompt: "What does n become in const n = first([10, 20, 30]) with function first<T>(items: T[]): T | undefined?", options: [{ id: "a", text: "any" }, { id: "b", text: "T" }, { id: "c", text: "number | undefined" }, { id: "d", text: "number[]" }], correct: "c", explanation: "T is filled in as number from the argument, so the return type is number | undefined." },
        { id: "q2", prompt: "Which utility type makes every property of a type optional?", options: [{ id: "a", text: "Partial" }, { id: "b", text: "Pick" }, { id: "c", text: "Omit" }, { id: "d", text: "Record" }], correct: "a", explanation: "Partial<User> has all the same keys as User, but each one is optional." },
        { id: "q3", prompt: "What is Omit<User, \"id\"> if User has id, name, and email?", options: [{ id: "a", text: "{ id: number }" }, { id: "b", text: "User with every key optional" }, { id: "c", text: "An error" }, { id: "d", text: "{ name: string; email: string }" }], correct: "d", explanation: "Omit removes the listed keys and keeps the rest." },
        { id: "q4", prompt: "What does adding as const to an object do?", options: [{ id: "a", text: "Copies the object" }, { id: "b", text: "Makes its values readonly literal types" }, { id: "c", text: "Converts it into an enum" }, { id: "d", text: "Makes every property optional" }], correct: "b", explanation: "as const locks the values so TypeScript treats them as exact, unchangeable literals." },
        { id: "q5", prompt: "What is the return type of an async function that resolves to a User?", options: [{ id: "a", text: "User" }, { id: "b", text: "async User" }, { id: "c", text: "Promise<User>" }, { id: "d", text: "void" }], correct: "c", explanation: "Async functions always return a promise, so the type is Promise<User>." },
        { id: "q6", prompt: "Inside an async function, what type is user after const user = await loadUser(1), where loadUser returns Promise<User>?", options: [{ id: "a", text: "Promise<User>" }, { id: "b", text: "unknown" }, { id: "c", text: "any" }, { id: "d", text: "User" }], correct: "d", explanation: "await unwraps the promise and gives you the plain User value." },
        { id: "q7", prompt: "What happens if you render a component without a prop its props interface requires?", options: [{ id: "a", text: "TypeScript reports that the prop is missing" }, { id: "b", text: "The prop is set to an empty string" }, { id: "c", text: "React ignores the component" }, { id: "d", text: "Nothing until the page runs" }], correct: "a", explanation: "TypeScript checks every use of the component against its props type." },
      ],
    },
  ],
};

export default typescriptBasics;
