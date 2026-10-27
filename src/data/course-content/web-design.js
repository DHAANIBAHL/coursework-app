const webDesign = {
  slug: "web-design",
  tag: "Design",
  title: "Introduction to Web Design",
  image: "/images/Web design.jpg",
  color: "bg-blue-400",
  description: "The three building blocks of every web page — structure, style, and layout that holds up on any screen.",
  lessons: [
    {
      title: "HTML Basics",
      video: "/videos/Introduction to Web design/C1L1 (Web design).mp4",
      body: "HTML describes what's on a page, not how it looks. Every piece of content sits inside an element — a tag that says what that content is: a heading, a paragraph, a link, a list.",
      code: `<h1>Page title</h1>
<p>A paragraph of text.</p>
<a href="about.html">About</a>`,
      after: "Elements nest inside each other to build structure. Getting the structure right first — before any styling — makes everything after this lesson much easier.",
    },
    {
      title: "The Document Head and Viewport",
      video: "/videos/Introduction to Web design/C1L2.mp4",
      body: "Every page has a <head> that holds information about the page rather than content shown on it. The <title> appears in the browser tab, and the viewport meta tag tells phones to use the real screen width instead of zooming out.",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Portfolio</title>
  <meta name="description" content="Projects and writing by Sam.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello!</h1>
</body>
</html>`,
      after: "Without the viewport tag, media queries won't behave properly on phones, so add it to every page you build.",
    },
    {
      title: "Semantic HTML",
      video: "/videos/Introduction to Web design/C1L3.mp4",
      body: "Semantic elements describe the role of a section, not just that it exists. Tags like <header>, <nav>, <main>, and <footer> tell browsers, screen readers, and search engines how your page is organized.",
      code: `<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>My first post</h1>
    <p>Semantic tags describe their content.</p>
  </article>
</main>

<footer>© 2026 My Site</footer>`,
      after: "Reach for a semantic tag first and fall back to <div> only when nothing else fits.",
    },
    {
      title: "Links, Images, and Lists",
      video: "/videos/Introduction to Web design/C1L4.mp4",
      body: "Links connect pages with the href attribute, images load with src, and lists group related items. Every image needs an alt attribute that describes it for people who can't see it.",
      code: `<a href="https://example.com" target="_blank">Visit Example</a>

<img src="/images/cat.jpg" alt="A grey cat asleep on a sofa">

<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>`,
      after: "Use <ul> when order doesn't matter and <ol> when it does, like steps in a recipe.",
    },
    {
      title: "Tables",
      video: "/videos/Introduction to Web design/C1L5.mp4",
      body: "Tables display data in rows and columns. Each row is a <tr>, header cells are <th>, and regular data cells are <td>.",
      code: `<table>
  <caption>Class schedule</caption>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Topic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monday</td>
      <td>HTML</td>
    </tr>
  </tbody>
</table>`,
      after: "Use tables only for real tabular data like schedules or prices — never for page layout, which is CSS's job.",
    },
    {
      title: "Forms and Inputs",
      video: "/videos/Introduction to Web design/C1L6.mp4",
      body: "Forms collect information from visitors. Each input should have a <label> linked to it through matching for and id attributes, so clicking the label focuses the field.",
      code: `<form>
  <label for="email">Email</label>
  <input id="email" type="email" required>

  <label for="msg">Message</label>
  <textarea id="msg" rows="4"></textarea>

  <button type="submit">Send message</button>
</form>`,
      after: "The type attribute matters: type=\"email\" brings up the right keyboard on phones and checks the format for you.",
    },
    {
      title: "CSS Fundamentals",
      body: "CSS attaches style to HTML using selectors — rules that say which elements a style applies to.",
      code: `p {
  color: #333;
  font-size: 16px;
}

.highlight {
  background-color: yellow;
}`,
      after: "A class selector like .highlight targets only elements with that class — this is what you'll use most.",
    },
    {
      title: "Selectors and the Cascade",
      body: "Selectors can be combined to target elements by position or state, like nav a or a:hover. When two rules clash, the more specific selector wins, and if they tie, the one that comes later in the file wins.",
      code: `/* Descendant: links inside the nav */
nav a { color: #16273b; }

/* Pseudo-class: only while hovered */
nav a:hover { color: #2f6fed; }

/* Specificity: an id beats a class, a class beats a tag */
p { color: black; }
.note { color: green; }
#intro { color: purple; }`,
      after: "If a style isn't applying, a more specific rule is probably overriding it — browser dev tools show the losing rules crossed out.",
    },
    {
      title: "The Box Model",
      body: "Every element is a box made of four layers: content, padding, border, and margin. Padding is space inside the border, margin is space outside it.",
      code: `* {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 16px;
  border: 1px solid #ccc;
  margin: 24px;
}`,
      after: "With box-sizing: border-box, the 300px width includes padding and border, so the card never grows wider than you asked.",
    },
    {
      title: "Colors, Fonts, and Units",
      body: "Colors can be written as hex codes, rgb(), or named colors. For sizes, px is fixed, while rem scales with the user's browser font setting, which makes text more accessible.",
      code: `body {
  font-family: "Inter", Arial, sans-serif;
  font-size: 1rem;      /* usually 16px */
  color: #16273b;
  line-height: 1.6;
}

h1 {
  font-size: 2.5rem;
  color: rgb(47, 111, 237);
}`,
      after: "Always list fallback fonts after your first choice, in case it fails to load.",
    },
    {
      title: "Positioning",
      body: "The position property lets you place elements outside the normal flow. An absolute element is placed relative to its nearest positioned ancestor, and a sticky element scrolls normally until it reaches an offset, then stays put.",
      code: `.card {
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
}`,
      after: "Set position: relative on the parent whenever you absolutely position a child, or the child will anchor to the whole page instead.",
    },
    {
      title: "Flexbox in Depth",
      body: "Flexbox lines items up along one direction. justify-content controls spacing along that direction, and align-items controls alignment across it.",
      code: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.navbar .logo {
  flex-shrink: 0;
}`,
      after: "space-between pushes the first and last items to the edges — the classic logo-left, links-right navbar.",
    },
    {
      title: "CSS Grid",
      body: "Grid lays items out in rows and columns at the same time. It's the best tool for card layouts and full page structures.",
      code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.featured {
  grid-column: span 2;
}`,
      after: "1fr means one share of the leftover space, so three 1fr columns are always equal width.",
    },
    {
      title: "Responsive Layouts",
      body: "A responsive layout adapts to whatever screen it's shown on. Flexbox arranges items in a row or column, and media queries change styles at specific screen widths.",
      code: `.row {
  display: flex;
  gap: 16px;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
  }
}`,
      after: "That media query stacks items below 600px wide instead of placing them side by side.",
    },
    {
      title: "Responsive Images",
      body: "Images should shrink to fit their container instead of spilling out of it. max-width: 100% handles the sizing, and srcset lets the browser download a smaller file on smaller screens.",
      code: `<img
  src="/images/hero-800.jpg"
  srcset="/images/hero-800.jpg 800w, /images/hero-1600.jpg 1600w"
  sizes="100vw"
  alt="Mountains at sunrise">

<style>
  img {
    max-width: 100%;
    height: auto;
  }
</style>`,
      after: "Adding height: auto keeps the image's proportions, so it scales down without stretching or squashing.",
    },
    {
      title: "CSS Custom Properties",
      body: "Custom properties, also called CSS variables, let you name a value once and reuse it everywhere. Change the variable and every place that uses it updates.",
      code: `:root {
  --accent: #2f6fed;
  --radius: 8px;
}

.button {
  background: var(--accent);
  border-radius: var(--radius);
}

.link {
  color: var(--accent);
}`,
      after: "This is how design systems keep colors and spacing consistent across a whole site.",
    },
    {
      title: "Transitions and Hover States",
      body: "Hover states give visual feedback when the pointer is over an element. A transition smooths the change over a short time instead of letting it snap instantly.",
      code: `.button {
  background: #2f6fed;
  color: white;
  transition: background 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background: #1d4fc4;
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}`,
      after: "Put the transition on the base rule, not the :hover rule, so the effect animates both in and out.",
    },
    {
      title: "Accessibility Basics",
      body: "An accessible site works for everyone, including people using keyboards or screen readers. Good contrast, visible focus outlines, and descriptive labels cover most of the basics.",
      code: `<button aria-label="Close menu">✕</button>

<a href="#main" class="skip-link">Skip to content</a>

<style>
  :focus-visible {
    outline: 2px solid #2f6fed;
    outline-offset: 2px;
  }
</style>`,
      after: "Try navigating your own page with only the Tab key — anything you can't reach or can't see is worth fixing.",
    },
  ],
  quizzes: [
    {
      id: "html-foundations",
      title: "HTML Foundations",
      description: "Lessons 1–6: structure, the page head, semantics, links, tables, and forms.",
      questions: [
        { id: "q1", prompt: "Which HTML element is used for the largest heading?", options: [{ id: "a", text: "<h6>" }, { id: "b", text: "<p>" }, { id: "c", text: "<title>" }, { id: "d", text: "<h1>" }], correct: "d", explanation: "Headings run from h1 (largest) to h6 (smallest)." },
        { id: "q2", prompt: "Which best describes HTML's role?", options: [{ id: "a", text: "Styling content" }, { id: "b", text: "Describing the structure and meaning of content" }, { id: "c", text: "Handling user interaction" }, { id: "d", text: "Managing server data" }], correct: "b", explanation: "HTML describes what content is, separate from how it looks." },
        { id: "q3", prompt: "What does the viewport meta tag do?", options: [{ id: "a", text: "Tells phones to use the device's real screen width instead of zooming out" }, { id: "b", text: "Sets the text shown in the browser tab" }, { id: "c", text: "Links an external stylesheet" }, { id: "d", text: "Hides the page from search engines" }], correct: "a", explanation: "width=device-width makes phones render the page at their actual width, so responsive styles work." },
        { id: "q4", prompt: "Which semantic element is meant for a group of site navigation links?", options: [{ id: "a", text: "<div>" }, { id: "b", text: "<footer>" }, { id: "c", text: "<nav>" }, { id: "d", text: "<article>" }], correct: "c", explanation: "<nav> tells browsers and screen readers that its links are for navigating the site." },
        { id: "q5", prompt: "Why should every image have an alt attribute?", options: [{ id: "a", text: "It makes the image load faster" }, { id: "b", text: "It sets the image's width" }, { id: "c", text: "It links the image to another page" }, { id: "d", text: "It describes the image for people who can't see it" }], correct: "d", explanation: "Screen readers read the alt text aloud, and it also shows if the image fails to load." },
        { id: "q6", prompt: "Which element creates a header cell in a table?", options: [{ id: "a", text: "<td>" }, { id: "b", text: "<th>" }, { id: "c", text: "<tr>" }, { id: "d", text: "<caption>" }], correct: "b", explanation: "<th> marks a header cell, while <td> is a regular data cell and <tr> is a row." },
        { id: "q7", prompt: "How do you link a <label> to its input?", options: [{ id: "a", text: "Put the label after the input" }, { id: "b", text: "Give both the same class" }, { id: "c", text: "Match the label's for attribute to the input's id" }, { id: "d", text: "Add type=\"label\" to the input" }], correct: "c", explanation: "A matching for and id pair connects them, so clicking the label focuses the field." },
      ],
    },
    {
      id: "styling-and-boxes",
      title: "Styling and Boxes",
      description: "Lessons 7–12: selectors, the cascade, the box model, units, positioning, and flexbox.",
      questions: [
        { id: "q1", prompt: 'Which CSS selector targets every element with class="highlight"?', options: [{ id: "a", text: "highlight" }, { id: "b", text: "#highlight" }, { id: "c", text: ".highlight" }, { id: "d", text: "*highlight" }], correct: "c", explanation: "A leading dot targets elements by class attribute." },
        { id: "q2", prompt: "Two rules with equal specificity set different colors on the same element. Which one wins?", options: [{ id: "a", text: "The one that comes later in the file" }, { id: "b", text: "The one that comes first in the file" }, { id: "c", text: "The shorter one" }, { id: "d", text: "Neither — the browser default is used" }], correct: "a", explanation: "When specificity ties, the cascade applies the rule that appears last." },
        { id: "q3", prompt: "Which of these selectors is the most specific?", options: [{ id: "a", text: "p" }, { id: "b", text: ".note" }, { id: "c", text: "*" }, { id: "d", text: "#intro" }], correct: "d", explanation: "An id selector beats a class, and a class beats a tag." },
        { id: "q4", prompt: "In the box model, what is padding?", options: [{ id: "a", text: "Space outside the border" }, { id: "b", text: "Space inside the border, around the content" }, { id: "c", text: "The thickness of the border" }, { id: "d", text: "The width of the content only" }], correct: "b", explanation: "Padding sits between the content and the border, while margin sits outside the border." },
        { id: "q5", prompt: "What does box-sizing: border-box change?", options: [{ id: "a", text: "The set width includes padding and border" }, { id: "b", text: "It removes all borders" }, { id: "c", text: "It adds a margin around every box" }, { id: "d", text: "It makes boxes fill the full screen" }], correct: "a", explanation: "With border-box, padding and border fit inside the width you set instead of adding to it." },
        { id: "q6", prompt: "Why is rem often better than px for font sizes?", options: [{ id: "a", text: "rem loads faster" }, { id: "b", text: "rem works only on phones" }, { id: "c", text: "rem scales with the user's browser font setting" }, { id: "d", text: "rem always equals exactly 10px" }], correct: "c", explanation: "rem is relative to the root font size, so text respects users who set a larger default." },
        { id: "q7", prompt: "An element with position: absolute is placed relative to what?", options: [{ id: "a", text: "Its previous sibling" }, { id: "b", text: "The browser's scrollbar" }, { id: "c", text: "Its own original spot" }, { id: "d", text: "Its nearest positioned ancestor" }], correct: "d", explanation: "It anchors to the closest ancestor with a position set, or to the page if there isn't one." },
        { id: "q8", prompt: "By default, what does display: flex do to an element's direct children?", options: [{ id: "a", text: "Stacks them vertically" }, { id: "b", text: "Arranges them in a row" }, { id: "c", text: "Hides them" }, { id: "d", text: "Makes them absolutely positioned" }], correct: "b", explanation: "Flexbox arranges children in a row by default." },
      ],
    },
    {
      id: "layout-and-polish",
      title: "Layout and Polish",
      description: "Lessons 13–18: grid, responsive layouts and images, variables, transitions, and accessibility.",
      questions: [
        { id: "q1", prompt: "In CSS Grid, what does 1fr mean?", options: [{ id: "a", text: "One share of the leftover space" }, { id: "b", text: "One pixel" }, { id: "c", text: "One full row" }, { id: "d", text: "One rem" }], correct: "a", explanation: "fr divides the remaining space, so three 1fr columns are always equal width." },
        { id: "q2", prompt: "What is a media query used for?", options: [{ id: "a", text: "Loading images faster" }, { id: "b", text: "Applying styles conditionally based on screen size" }, { id: "c", text: "Linking an external stylesheet" }, { id: "d", text: "Validating HTML syntax" }], correct: "b", explanation: "Media queries apply different rules depending on screen width." },
        { id: "q3", prompt: "What does max-width: 100% do for an image?", options: [{ id: "a", text: "Always stretches it to the full screen" }, { id: "b", text: "Crops it into a square" }, { id: "c", text: "Doubles its resolution" }, { id: "d", text: "Stops it from growing wider than its container" }], correct: "d", explanation: "The image can shrink to fit its container but never spills out of it." },
        { id: "q4", prompt: "What does the srcset attribute let the browser do?", options: [{ id: "a", text: "Add a caption under the image" }, { id: "b", text: "Load images from several sites at once" }, { id: "c", text: "Pick a suitably sized image file for the screen" }, { id: "d", text: "Animate between images" }], correct: "c", explanation: "srcset lists several file sizes so smaller screens can download a smaller image." },
        { id: "q5", prompt: "How do you use a custom property named --accent?", options: [{ id: "a", text: "var(--accent)" }, { id: "b", text: "$accent" }, { id: "c", text: "@accent" }, { id: "d", text: "accent()" }], correct: "a", explanation: "The var() function reads the value of a custom property." },
        { id: "q6", prompt: "Where should you put the transition property for a hover effect?", options: [{ id: "a", text: "Only on the :hover rule" }, { id: "b", text: "In the HTML tag" }, { id: "c", text: "On the element's base rule" }, { id: "d", text: "Inside a media query" }], correct: "c", explanation: "On the base rule, the transition animates both when the hover starts and when it ends." },
        { id: "q7", prompt: "What's a quick way to check your page's keyboard accessibility?", options: [{ id: "a", text: "Resize the browser window" }, { id: "b", text: "Turn off all images" }, { id: "c", text: "Switch to dark mode" }, { id: "d", text: "Navigate using only the Tab key" }], correct: "d", explanation: "Tabbing through reveals anything you can't reach or whose focus you can't see." },
      ],
    },
  ],
};

export default webDesign;
