const artificialIntelligence = {
  slug: "artificial-intelligence",
  tag: "Tools",
  title: "Artificial Intelligence",
  image: "/images/Artificial Intelligence.png",
  color: "bg-slate-800",
  description: "How AI systems perceive, reason, and generate — and where each capability breaks down in practice.",
  lessons: [
    {
      title: "What Counts as AI",
      body: "Artificial intelligence is any system that performs tasks we'd normally say need human intelligence, like recognizing faces, translating languages, or answering questions. Almost all AI in use today is narrow: very good at one kind of task and unable to do others.",
      code: `Narrow AI examples:
- Spam filters        -> classify emails
- Face unlock         -> recognize one face
- Maps routing        -> find the fastest path
- Chat assistants     -> generate text

General AI (human-level at everything):
- Doesn't exist yet`,
      after: "When someone says \"AI\", ask what specific task it does — that tells you far more than the label.",
    },
    {
      title: "Rules vs. Learning",
      body: "Older AI systems followed rules written by people. Modern AI learns patterns from examples instead, which handles messy real-world input far better but makes its decisions harder to explain.",
      code: `# Rule-based: a person writes the logic
def is_spam(email):
    return "win a prize" in email.lower()

# Learned: the model finds patterns in examples
# training_data = [(email_text, is_spam), ...]
# model.fit(training_data)
# model.predict("Claim your free reward now")`,
      after: "Rules break on anything their author didn't anticipate; learned models break on anything unlike their training data.",
    },
    {
      title: "A Short History of AI",
      body: "AI research began in the 1950s with hand-written rules and logic, then went through cycles of hype and disappointment known as \"AI winters\". Progress sped up once there was enough data and computing power to train large neural networks that learn from examples.",
      code: `1950s  "Artificial intelligence" named; early logic programs
1980s  Expert systems built from hand-written rules
1990s  Machine learning grows; computers beat chess champions
2010s  Deep learning takes off in vision and speech
2020s  Large language models reach everyday users`,
      after: "Big claims about AI have come and gone before, so judge a tool by what it actually does today.",
    },
    {
      title: "Perception: Seeing and Hearing",
      body: "Computer vision and speech recognition let AI take in images and audio. They work by finding patterns in pixels or sound waves that match what they saw during training.",
      code: `Image  -> pixels -> model -> "cat" (94% confident)
Audio  -> waveform -> model -> "turn on the lights"

Where it breaks:
- Poor lighting or unusual angles
- Accents or noise it rarely heard in training
- Objects that look alike (muffin vs. chihuahua)`,
      after: "A confidence score isn't a guarantee — models can be very confident and still wrong.",
    },
    {
      title: "How Language Models Generate Text",
      body: "A large language model writes by predicting the next piece of text, over and over. It learned which words tend to follow which from a huge amount of written material.",
      code: `Prompt: "The capital of France is"

Model's likely next words:
  " Paris"   0.92
  " a"       0.03
  " located" 0.02

It picks one, adds it, and predicts again.`,
      after: "Because it predicts likely text rather than looking facts up, fluent output isn't the same as correct output.",
    },
    {
      title: "Tokens and Context Windows",
      body: "Models read text in tokens — chunks that are often part of a word. The context window is how many tokens the model can consider at once, including your prompt and its reply.",
      code: `"Understanding tokens" might split into:
["Under", "standing", " tok", "ens"]

Rough guide for English:
1 token  ≈ 4 characters
100 tokens ≈ 75 words`,
      after: "If a conversation gets longer than the context window, the earliest parts fall out of view.",
    },
    {
      title: "Embeddings and Semantic Search",
      body: "An embedding turns a piece of text into a list of numbers that captures its meaning, so texts with similar meanings end up close together. Semantic search uses this to find results that match what you mean, even when they share no exact words with your query.",
      code: `Query: "how do I reset my password"

Keyword search finds:  pages containing "reset" and "password"
Semantic search finds: "Forgot your login? Here's how to
                        get back into your account"

Similar meaning -> nearby numbers -> good match`,
      after: "Many AI tools use this to fetch relevant documents first, then answer from them instead of from memory alone.",
    },
    {
      title: "Reasoning and Its Limits",
      body: "Language models can work through problems step by step, and asking them to do so often improves results. They can still slip on arithmetic, lose track of long chains of logic, or sound certain about a flawed argument.",
      code: `Weaker prompt:
"What's 17% of 3,450?"

Stronger prompt:
"What's 17% of 3,450? Work it out step by step,
then give the final answer on its own line."`,
      after: "For anything that matters, check the steps, not just the final answer.",
    },
    {
      title: "Writing Clear Prompts",
      body: "A prompt works best when it says exactly what you want, who it's for, and what the result should look like. Vague prompts get vague answers.",
      code: `Vague:
"Write about Python."

Clear:
"Write a 150-word introduction to Python for
high-school students who have never coded.
Use a friendly tone and end with one simple
example they could try."`,
      after: "Think of it as briefing a smart new colleague who knows nothing about your situation.",
    },
    {
      title: "Giving Examples",
      body: "Showing the model a few examples of what you want, called few-shot prompting, is often more effective than describing it. The model copies the pattern.",
      code: `Turn product names into URL slugs.

"Intro to Node.js"     -> intro-to-nodejs
"SQL & Databases"      -> sql-databases
"Python for Beginners" -> python-for-beginners

"Machine Learning Basics" ->`,
      after: "Pick examples that cover the tricky cases, like the & in the second line.",
    },
    {
      title: "Asking for Structured Output",
      body: "When your code needs to use a model's answer, ask for a fixed format like JSON. Describe every field and say not to include anything else.",
      code: `Prompt:
"Extract the course details below. Reply with
only JSON in this shape, no other text:
{ "title": string, "lessons": number, "level": string }

Text: Our beginner Python course has 12 lessons."

Reply:
{ "title": "Python", "lessons": 12, "level": "beginner" }`,
      after: "Always check the output parses correctly before your code relies on it.",
    },
    {
      title: "AI Agents and Tool Use",
      body: "An AI agent is a model that can take actions, not just reply — it decides which tool to call, like a web search, calculator, or calendar, looks at the result, and repeats until the task is done. This makes it far more capable, but a mistake can now change real things.",
      code: `Task: "Book a meeting with Sam next Tuesday"

1. Model calls: check_calendar("next Tuesday")
2. Tool returns: free 10:00-11:00, 14:00-15:00
3. Model calls: send_invite("Sam", "Tuesday 10:00")
4. Model replies: "Invite sent for Tuesday at 10:00."`,
      after: "Give agents only the permissions they need, and ask them to confirm before anything hard to undo.",
    },
    {
      title: "Hallucinations and Fact-Checking",
      body: "A hallucination is when a model states something false as if it were true — an invented statistic, quote, or source. It happens because the model is producing likely-sounding text.",
      code: `Ways to reduce it:
- Give the model the source text to work from
- Ask it to say "I don't know" when unsure
- Ask for sources, then open them yourself
- Verify names, numbers, dates, and quotes`,
      after: "Treat AI output like a first draft from someone who writes well but sometimes misremembers.",
    },
    {
      title: "Bias in Training Data",
      body: "Models learn from data made by people, so they can absorb people's biases. If some groups are missing or misrepresented in the data, the model performs worse or unfairly for them.",
      code: `Example:
A hiring model trained on 10 years of past hires
learns to prefer candidates who resemble them.

Checks worth doing:
- Who is represented in the data?
- Does accuracy differ between groups?
- Who is harmed if the model is wrong?`,
      after: "Bias isn't only a data problem — how and where a model is used matters just as much.",
    },
    {
      title: "Using AI Responsibly",
      body: "Good AI use means knowing what to share, what to check, and when a person should make the final call. Be open about where AI helped with your work.",
      code: `Before you paste something in, ask:
- Is this private or someone else's data?
- Would I be okay if it were stored?

Before you use the answer, ask:
- Have I checked the facts?
- Should a person decide this, not the tool?`,
      after: "AI is a powerful assistant, but you're still responsible for what you do with its output.",
    },
  ],
  quizzes: [
    {
      id: "ai-foundations",
      title: "AI Foundations",
      description: "Lessons 1–5: what AI is, how it learns, its history, perception, and text generation.",
      questions: [
        { id: "q1", prompt: "What does \"narrow AI\" mean?", options: [{ id: "a", text: "AI that runs only on small devices" }, { id: "b", text: "AI that is very good at one kind of task but can't do others" }, { id: "c", text: "AI that matches humans at every task" }, { id: "d", text: "AI that follows only hand-written rules" }], correct: "b", explanation: "Narrow AI excels at a specific task, like filtering spam, and is unable to do unrelated tasks." },
        { id: "q2", prompt: "How does modern AI mostly differ from older rule-based systems?", options: [{ id: "a", text: "It never makes mistakes" }, { id: "b", text: "It is always easier to explain" }, { id: "c", text: "It learns patterns from examples instead of following rules people wrote" }, { id: "d", text: "It only works with numbers" }], correct: "c", explanation: "Modern AI learns from examples, which handles messy input better but makes decisions harder to explain." },
        { id: "q3", prompt: "Where does a learned model tend to break down?", options: [{ id: "a", text: "On input unlike its training data" }, { id: "b", text: "On any input longer than one sentence" }, { id: "c", text: "Only when its rules are deleted" }, { id: "d", text: "It never breaks down once trained" }], correct: "a", explanation: "Learned models break on anything unlike the data they were trained on." },
        { id: "q4", prompt: "What were \"AI winters\"?", options: [{ id: "a", text: "Seasons when computers ran faster in the cold" }, { id: "b", text: "The first language models released to the public" }, { id: "c", text: "Periods when AI was banned by governments" }, { id: "d", text: "Periods of disappointment after waves of AI hype" }], correct: "d", explanation: "AI history has gone through cycles of hype followed by disappointment, known as AI winters." },
        { id: "q5", prompt: "What helped AI progress speed up in recent decades?", options: [{ id: "a", text: "Writing longer lists of rules by hand" }, { id: "b", text: "Enough data and computing power to train large neural networks" }, { id: "c", text: "Removing all training data" }, { id: "d", text: "Switching back to expert systems" }], correct: "b", explanation: "Progress accelerated once there was enough data and compute to train large neural networks that learn from examples." },
        { id: "q6", prompt: "An image model says \"cat (94% confident)\". What should you conclude?", options: [{ id: "a", text: "The image is definitely a cat" }, { id: "b", text: "The model can never be wrong above 90%" }, { id: "c", text: "The model is fairly confident, but it could still be wrong" }, { id: "d", text: "The model is guessing randomly" }], correct: "c", explanation: "A confidence score isn't a guarantee — models can be very confident and still wrong." },
        { id: "q7", prompt: "How does a large language model produce text?", options: [{ id: "a", text: "By predicting the next piece of text over and over" }, { id: "b", text: "By looking up each answer in a database of facts" }, { id: "c", text: "By copying a whole matching web page" }, { id: "d", text: "By asking a human to write each reply" }], correct: "a", explanation: "A language model writes by repeatedly predicting the likely next piece of text." },
        { id: "q8", prompt: "Why isn't fluent language model output guaranteed to be correct?", options: [{ id: "a", text: "Because it is translated from another language first" }, { id: "b", text: "Because models deliberately add errors" }, { id: "c", text: "Because output is shortened to save space" }, { id: "d", text: "Because it predicts likely text rather than checking facts" }], correct: "d", explanation: "The model produces likely-sounding text, so something can read smoothly and still be false." },
      ],
    },
    {
      id: "prompting-basics",
      title: "Prompting Basics",
      description: "Lessons 6–10: tokens, embeddings, reasoning, clear prompts, and examples.",
      questions: [
        { id: "q1", prompt: "What is a context window?", options: [{ id: "a", text: "The screen where you type prompts" }, { id: "b", text: "How many tokens the model can consider at once, including your prompt and its reply" }, { id: "c", text: "The time limit for getting a reply" }, { id: "d", text: "The list of websites the model has visited" }], correct: "b", explanation: "The context window is the number of tokens a model can take into account at one time, prompt and reply included." },
        { id: "q2", prompt: "What happens when a conversation grows longer than the context window?", options: [{ id: "a", text: "The model speeds up" }, { id: "b", text: "The model asks you to start a new account" }, { id: "c", text: "The earliest parts fall out of view" }, { id: "d", text: "Nothing, the model remembers everything forever" }], correct: "c", explanation: "Once the limit is exceeded, the earliest parts of the conversation are no longer visible to the model." },
        { id: "q3", prompt: "What does an embedding represent?", options: [{ id: "a", text: "The meaning of text as a list of numbers, with similar meanings close together" }, { id: "b", text: "A picture inserted into a document" }, { id: "c", text: "A password that protects a file" }, { id: "d", text: "The exact spelling of each word" }], correct: "a", explanation: "Embeddings turn text into numbers that capture meaning, so similar texts end up near each other." },
        { id: "q4", prompt: "How is semantic search different from keyword search?", options: [{ id: "a", text: "It only finds exact word matches" }, { id: "b", text: "It only searches images" }, { id: "c", text: "It ignores what the query means" }, { id: "d", text: "It can find results that match your meaning even without shared words" }], correct: "d", explanation: "Semantic search matches by meaning, so relevant results can appear even when they use different words." },
        { id: "q5", prompt: "What often improves a model's answer to a multi-step problem?", options: [{ id: "a", text: "Asking it to work through the problem step by step" }, { id: "b", text: "Asking it to answer in as few words as possible" }, { id: "c", text: "Writing the question in all capital letters" }, { id: "d", text: "Removing the numbers from the question" }], correct: "a", explanation: "Asking a model to reason step by step often improves results, though you should still check the steps." },
        { id: "q6", prompt: "Which prompt is clearest?", options: [{ id: "a", text: "\"Write about Python.\"" }, { id: "b", text: "\"Tell me stuff.\"" }, { id: "c", text: "\"Write a 150-word Python introduction for high-school beginners, friendly tone, ending with one simple example.\"" }, { id: "d", text: "\"Python?\"" }], correct: "c", explanation: "A clear prompt says what you want, who it's for, and what the result should look like." },
        { id: "q7", prompt: "What is few-shot prompting?", options: [{ id: "a", text: "Sending the same prompt a few times" }, { id: "b", text: "Showing the model a few examples of what you want so it copies the pattern" }, { id: "c", text: "Limiting the reply to a few words" }, { id: "d", text: "Using a smaller model to save time" }], correct: "b", explanation: "Few-shot prompting gives the model example inputs and outputs so it can follow the pattern." },
      ],
    },
    {
      id: "using-ai-well",
      title: "Using AI Well",
      description: "Lessons 11–15: structured output, agents, hallucinations, bias, and responsible use.",
      questions: [
        { id: "q1", prompt: "When your code needs to use a model's answer, what should you ask for?", options: [{ id: "a", text: "A long friendly paragraph" }, { id: "b", text: "An answer in a random format each time" }, { id: "c", text: "A poem summarizing the result" }, { id: "d", text: "A fixed format like JSON, with every field described" }], correct: "d", explanation: "A fixed, described format like JSON makes the output something your code can reliably use." },
        { id: "q2", prompt: "What should you do before your code relies on a model's JSON output?", options: [{ id: "a", text: "Check that it parses correctly" }, { id: "b", text: "Assume it is always valid" }, { id: "c", text: "Convert it to an image" }, { id: "d", text: "Delete any fields you don't recognize without looking" }], correct: "a", explanation: "Model output can still be malformed, so check that it parses before relying on it." },
        { id: "q3", prompt: "What makes an AI agent different from a plain chat reply?", options: [{ id: "a", text: "It only answers yes or no" }, { id: "b", text: "It can call tools and take actions, checking results until the task is done" }, { id: "c", text: "It never uses a language model" }, { id: "d", text: "It works without any instructions" }], correct: "b", explanation: "An agent decides which tools to call, looks at the results, and repeats until the task is complete." },
        { id: "q4", prompt: "What is a sensible safeguard when using an AI agent?", options: [{ id: "a", text: "Give it full access to every account" }, { id: "b", text: "Never look at what it did" }, { id: "c", text: "Give it only the permissions it needs and have it confirm hard-to-undo actions" }, { id: "d", text: "Let it run without any task description" }], correct: "c", explanation: "Because agent mistakes can change real things, limit permissions and require confirmation for irreversible actions." },
        { id: "q5", prompt: "What is a hallucination in AI?", options: [{ id: "a", text: "When a model states something false as if it were true" }, { id: "b", text: "When a model refuses to answer" }, { id: "c", text: "When a model generates an image" }, { id: "d", text: "When a model runs out of tokens" }], correct: "a", explanation: "A hallucination is false information, such as an invented quote or source, presented as fact." },
        { id: "q6", prompt: "Which is a good way to reduce hallucinations?", options: [{ id: "a", text: "Ask the model to never admit uncertainty" }, { id: "b", text: "Trust any source the model lists without opening it" }, { id: "c", text: "Ask for longer answers" }, { id: "d", text: "Give the model the source text to work from" }], correct: "d", explanation: "Providing the source text gives the model something real to work from instead of relying on memory." },
        { id: "q7", prompt: "Why can AI models be biased?", options: [{ id: "a", text: "They choose to favour certain people" }, { id: "b", text: "They learn from data made by people, which can contain people's biases" }, { id: "c", text: "Bias only comes from slow computers" }, { id: "d", text: "Models can't be biased if they are large enough" }], correct: "b", explanation: "Models absorb biases present in human-made data, especially when groups are missing or misrepresented." },
        { id: "q8", prompt: "Who is responsible for what you do with AI output?", options: [{ id: "a", text: "Only the company that built the tool" }, { id: "b", text: "Nobody, since a machine produced it" }, { id: "c", text: "You are" }, { id: "d", text: "Whoever wrote the training data" }], correct: "c", explanation: "AI is an assistant, but you remain responsible for how you use its output." },
      ],
    },
  ],
};

export default artificialIntelligence;
