// All course content lives here. Each course needs a unique `slug` —
// it becomes the URL: /course/<slug>

export const courses = [
  {
    slug: "web-design",
    tag: "Design",
    title: "Web Design",
    description:
      "Learn how web pages are structured, styled, and made to work on any screen size.",
    color: "bg-blue-500",
    image: "/images/Web design.jpg",
    lessons: [
      {
        title: "Structuring a page with semantic HTML",
        body:
          "Semantic elements describe what their content is, not how it looks. Screen readers, search engines, and other developers all rely on them to understand your page. Reach for <header>, <nav>, <main>, <article>, and <footer> before falling back to a plain <div>.",
        code: `<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>My first page</h1>
      <p>Semantic tags describe the content inside them.</p>
    </article>
  </main>

  <footer>© 2026 My Site</footer>
</body>`,
      },
      {
        title: "The box model and Flexbox layout",
        body:
          "Every element is a box made of content, padding, border, and margin. Setting box-sizing: border-box makes widths include padding and border, which is far easier to reason about. Flexbox then lets you line boxes up in a row or column and control the space between them.",
        code: `* {
  box-sizing: border-box;
}

.card {
  padding: 1rem;
  border: 1px solid #cbd5e1;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}`,
      },
      {
        title: "Responsive design with media queries",
        body:
          "Responsive pages adapt to the screen they're viewed on. A common approach is mobile-first: write the default styles for small screens, then add media queries that adjust the layout as the screen gets wider.",
        code: `.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
      },
    ],
    quiz: [
      {
        question: "Which element should wrap the main content of a page?",
        options: ["<div>", "<main>", "<section>", "<body>"],
        answer: 1,
        explanation:
          "<main> marks the primary content of the page. There should be only one per page.",
      },
      {
        question: "What does box-sizing: border-box change?",
        options: [
          "It adds a border to every element",
          "It makes width include padding and border",
          "It removes all margins",
          "It turns the element into a flex container",
        ],
        answer: 1,
        explanation:
          "With border-box, the width you set includes padding and border, so the box never grows larger than expected.",
      },
      {
        question: "Which property puts space between flex items?",
        options: ["padding", "margin-inline", "gap", "spacing"],
        answer: 2,
        explanation:
          "gap sets the space between items in a flex or grid container without adding margin to the outer edges.",
      },
      {
        question: "In a mobile-first stylesheet, what do media queries usually target?",
        options: [
          "max-width, to shrink desktop layouts",
          "min-width, to expand small-screen layouts",
          "orientation only",
          "print styles",
        ],
        answer: 1,
        explanation:
          "Mobile-first means the default styles are for small screens, and min-width queries add changes as the screen gets wider.",
      },
      {
        question: "Why use semantic HTML over plain <div> elements?",
        options: [
          "It makes pages load faster",
          "It's required for CSS to work",
          "It tells browsers, assistive tech, and search engines what the content is",
          "It automatically adds styling",
        ],
        answer: 2,
        explanation:
          "Semantic tags carry meaning. Screen readers use them for navigation and search engines use them to understand page structure.",
      },
    ],
  },
  {
    slug: "javascript-essentials",
    tag: "Programming",
    title: "JavaScript Essentials",
    description:
      "Variables, functions, arrays, and the DOM — the core ideas behind interactive web pages.",
    color: "bg-blue-600",
    image: "/images/JavaScript.png",
    lessons: [],
    quiz: [],
  },
  {
    slug: "intro-to-nodejs",
    tag: "Backend",
    title: "Intro to Node.js",
    description:
      "Run JavaScript outside the browser and build your first server with Node and Express.",
    color: "bg-blue-800",
    image: "",
    lessons: [],
    quiz: [],
  },
  {
    slug: "python-for-beginners",
    tag: "Programming",
    title: "Python for Beginners",
    description:
      "Write your first Python programs and learn the syntax, data types, and control flow.",
    color: "bg-slate-700",
    image: "",
    lessons: [],
    quiz: [],
  },
  {
    slug: "artificial-intelligence",
    tag: "Tools",
    title: "Artificial Intelligence",
    description:
      "What AI is, how modern AI tools work, and how to use them well in your projects.",
    color: "bg-blue-400",
    image: "",
    lessons: [],
    quiz: [],
  },
  {
    slug: "machine-learning",
    tag: "Specialization",
    title: "Machine Learning",
    description:
      "How computers learn patterns from data, from training sets to simple models.",
    color: "bg-slate-800",
    image: "",
    lessons: [],
    quiz: [],
  },
  {
    slug: "sql-and-databases",
    tag: "Database",
    title: "SQL & Databases",
    description:
      "Store, query, and relate data with SQL — tables, joins, and everyday queries.",
    color: "bg-slate-900",
    image: "",
    lessons: [],
    quiz: [],
  },
];

// Look up one course by its slug. Returns undefined if no match.
export function getCourse(slug) {
  return courses.find((course) => course.slug === slug);
}
