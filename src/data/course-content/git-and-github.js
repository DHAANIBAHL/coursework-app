const gitAndGithub = {
  slug: "git-and-github",
  tag: "Tools",
  title: "Git & GitHub",
  image: "",
  color: "bg-orange-600",
  description: "Commits, branches, merges, and pull requests — how to track your code, undo mistakes, and work with other people without stepping on each other.",
  lessons: [
    {
      title: "What Version Control Is",
      body: "Version control records every change to your project so you can see what changed, when, and why. Git is the most popular version control tool, and GitHub is a website that hosts Git projects so people can share and collaborate on them.",
      code: `# Without version control
report.txt
report-final.txt
report-final-v2.txt
report-final-v2-REALLY-final.txt

# With Git: one file, and a history of every change
git log --oneline
# a1b2c3d Fix typo in conclusion
# 9f8e7d6 Add results section
# 4c5d6e7 First draft of report`,
      after: "Git works on your own computer; GitHub is just one place to put a copy online.",
    },
    {
      title: "Installing and Configuring Git",
      body: "Download Git from git-scm.com, or use your system's package manager, then check it works with git --version. Before your first commit, tell Git your name and email, because every commit is stamped with them.",
      code: `# Check that Git is installed
git --version
# git version 2.46.0

# Set your identity once for every project on this computer
git config --global user.name "Asha Rao"
git config --global user.email "asha@example.com"

# Make new projects start on a branch called main
git config --global init.defaultBranch main

# See your settings
git config --list`,
      after: "Use the same email you'll sign up to GitHub with so your commits link to your account.",
    },
    {
      title: "git init and the Three Areas",
      body: "git init turns a folder into a Git repository by creating a hidden .git folder. Your files move through three areas: the working directory where you edit, the staging area where you pick what goes into the next commit, and the repository where commits are saved for good.",
      code: `mkdir my-site
cd my-site
git init
# Initialized empty Git repository in /home/asha/my-site/.git/

# Working directory -> staging area -> repository
echo "<h1>Hello</h1>" > index.html   # edit (working directory)
git add index.html                    # stage it
git commit -m "Add homepage"          # save it (repository)`,
      after: "Never delete or edit the .git folder by hand; it holds your whole history.",
    },
    {
      title: "Staging and Committing",
      body: "git add puts changes in the staging area, and git commit saves everything staged as one snapshot with a message. A good message is short, starts with a verb, and says what the change does, like \"Add contact form\" rather than \"stuff\".",
      code: `# Stage one file, or everything that changed
git add index.html
git add .

# Save the staged changes with a message
git commit -m "Add contact form to homepage"
# [main 3f2a1b0] Add contact form to homepage
#  1 file changed, 12 insertions(+)

# Bad messages tell you nothing later
git commit -m "fixed stuff"   # avoid this`,
      after: "Commit small, related changes together so each commit is easy to understand and undo.",
    },
    {
      title: "Checking Your Work: status, log, and diff",
      body: "git status shows which files are changed, staged, or untracked. git log lists past commits, and git diff shows the exact lines you've changed but not yet committed.",
      code: `git status
# Changes not staged for commit:
#   modified:   index.html

git diff
# -<h1>Hello</h1>
# +<h1>Hello, world</h1>

git diff --staged      # changes already staged
git log --oneline      # one line per commit
# 3f2a1b0 Add contact form to homepage
# 9c8d7e6 Add homepage`,
      after: "Run git status constantly; it tells you what Git thinks is going on and often suggests the next command.",
    },
    {
      title: "Ignoring Files with .gitignore",
      body: "A .gitignore file lists files and folders Git should never track, like installed packages, build output, and secrets. Each line is a name or pattern, and ignored files stop showing up in git status.",
      code: `# .gitignore
node_modules/
dist/
.env
*.log
.DS_Store

# Commit the .gitignore itself so everyone shares it
git add .gitignore
git commit -m "Add gitignore"`,
      after: "Add .gitignore before your first commit, because files that are already tracked keep being tracked.",
    },
    {
      title: "Undoing Changes Safely",
      body: "git restore throws away uncommitted edits to a file, and git restore --staged unstages it without losing the edits. git reset --soft HEAD~1 undoes your last commit but keeps its changes staged, while git revert makes a new commit that reverses an old one, which is the safe choice once you've shared your work.",
      code: `# Discard edits in the working directory (can't be undone!)
git restore index.html

# Unstage a file but keep your edits
git restore --staged index.html

# Undo the last commit, keep its changes staged
git reset --soft HEAD~1

# Reverse a commit that's already been pushed
git revert 3f2a1b0
# [main 7a6b5c4] Revert "Add contact form to homepage"`,
      after: "Rewriting history with reset is fine for local commits; for anything already pushed, use revert.",
    },
    {
      title: "Branches",
      body: "A branch is a separate line of work, so you can build a feature without touching the main code. Creating a branch is instant and cheap, and switching branches changes the files in your folder to match.",
      code: `# List branches (* marks the current one)
git branch
# * main

# Create a branch and switch to it
git switch -c add-navbar

# Work and commit as usual
git add .
git commit -m "Add navbar"

# Go back to main
git switch main`,
      after: "Make a new branch for every feature or fix, and keep main working at all times.",
    },
    {
      title: "Merging Branches",
      body: "git merge brings the commits from another branch into the one you're on. If main hasn't changed since you branched, Git just moves main forward, which is called a fast-forward; otherwise it creates a merge commit joining the two.",
      code: `# Switch to the branch you want to merge INTO
git switch main

# Bring in the feature branch
git merge add-navbar
# Updating 9c8d7e6..4e5f6a7
# Fast-forward
#  index.html | 8 ++++++++

# Delete the branch once it's merged
git branch -d add-navbar`,
      after: "Always check which branch you're on before merging; you merge other branches into the current one.",
    },
    {
      title: "Resolving Merge Conflicts",
      body: "A conflict happens when two branches changed the same lines and Git can't tell which to keep. Git marks the spot in the file, you edit it to the version you want, then add and commit to finish the merge.",
      code: `git merge add-footer
# CONFLICT (content): Merge conflict in index.html

# Inside index.html:
<<<<<<< HEAD
<p>Contact us today</p>
=======
<p>Get in touch</p>
>>>>>>> add-footer

# Edit to keep what you want, delete the markers, then:
git add index.html
git commit`,
      after: "Conflicts are normal, not an error; if you get lost, git merge --abort puts everything back.",
    },
    {
      title: "Remotes and GitHub",
      body: "A remote is a copy of your repository hosted somewhere else, usually GitHub, and it's named origin by default. git push uploads your commits, git pull downloads new ones, and git clone copies an existing repository to your computer.",
      code: `# Copy a project from GitHub
git clone https://github.com/asha/my-site.git

# Or connect an existing local repo to a new GitHub repo
git remote add origin https://github.com/asha/my-site.git
git push -u origin main

# Later, share new commits and get others' commits
git push
git pull

git remote -v   # show where origin points`,
      after: "Pull before you start working each day so you're building on the latest code.",
    },
    {
      title: "Pull Requests and Code Review",
      body: "A pull request, or PR, asks to merge your branch into main on GitHub. Teammates can read the changes, leave comments on specific lines, and approve it before it's merged.",
      code: `# Push your feature branch to GitHub
git switch -c fix-login-button
git commit -am "Fix login button alignment"
git push -u origin fix-login-button

# On GitHub: click "Compare & pull request",
# describe what changed and why, then request reviewers

# Reviewer asks for a change? Just commit and push again
git commit -am "Use theme color for button"
git push   # the PR updates automatically`,
      after: "Keep PRs small and focused; a 50-line PR gets a careful review, a 2,000-line one gets a shrug.",
    },
    {
      title: "Forking and Contributing",
      body: "To contribute to a project you can't push to, you fork it, which makes your own copy on GitHub. You clone your fork, work on a branch, push to your fork, and open a pull request back to the original project, called upstream.",
      code: `# After clicking "Fork" on GitHub, clone YOUR copy
git clone https://github.com/asha/cool-library.git
cd cool-library

# Track the original project as "upstream"
git remote add upstream https://github.com/original/cool-library.git

# Stay up to date with the original
git pull upstream main

git switch -c fix-typo-in-readme
# ...commit, push to origin, then open a PR on GitHub`,
      after: "Read the project's CONTRIBUTING file first; it tells you how they want changes submitted.",
    },
    {
      title: "Rebasing Basics",
      body: "git rebase replays your branch's commits on top of another branch, giving a straight line of history instead of a merge commit. Because it rewrites commits, never rebase commits that other people have already pulled.",
      code: `# On your feature branch, catch up with main
git switch add-search
git rebase main
# Successfully rebased and updated refs/heads/add-search.

# Conflict during a rebase? Fix the file, then:
git add search.js
git rebase --continue

# Changed your mind?
git rebase --abort`,
      after: "Rebase your own local branches to tidy them up; merge anything that's shared.",
    },
    {
      title: "Stashing and Tags",
      body: "git stash shelves your uncommitted changes so you can switch branches with a clean folder, and git stash pop brings them back. Tags put a permanent name like v1.0.0 on a commit, and GitHub can turn a tag into a release.",
      code: `# Save unfinished work and clean the folder
git stash
git switch main          # fix something urgent...
git switch add-search
git stash pop            # your changes are back

# Mark a release
git tag -a v1.0.0 -m "First public release"
git push origin v1.0.0

git tag   # list tags
# v1.0.0`,
      after: "Tags aren't pushed by default, so push them explicitly when you cut a release.",
    },
  ],
  quizzes: [
    {
      id: "git-foundations",
      title: "Git Foundations",
      description: "Lessons 1–5: version control, setup, the three areas, commits, and checking your work.",
      questions: [
        { id: "q1", prompt: "What is the difference between Git and GitHub?", options: [{ id: "a", text: "They are two names for the same tool" }, { id: "b", text: "GitHub runs on your computer and Git is a website" }, { id: "c", text: "Git tracks changes on your computer, and GitHub hosts Git projects online" }, { id: "d", text: "Git only works with GitHub" }], correct: "c", explanation: "Git is the version control tool itself, and GitHub is one website that hosts copies of Git repositories." },
        { id: "q2", prompt: "Which command sets the name stamped on your commits for every project?", options: [{ id: "a", text: 'git config --global user.name "Asha Rao"' }, { id: "b", text: 'git init --name "Asha Rao"' }, { id: "c", text: 'git commit --author "Asha Rao"' }, { id: "d", text: 'git user "Asha Rao"' }], correct: "a", explanation: "git config --global user.name sets your name once for all repositories on that computer." },
        { id: "q3", prompt: "What does git init create?", options: [{ id: "a", text: "A new GitHub repository" }, { id: "b", text: "A first commit" }, { id: "c", text: "A .gitignore file" }, { id: "d", text: "A hidden .git folder that holds the history" }], correct: "d", explanation: "git init turns the folder into a repository by creating the .git folder where Git stores everything." },
        { id: "q4", prompt: "After git add index.html, where is the change?", options: [{ id: "a", text: "Only in the working directory" }, { id: "b", text: "In the staging area" }, { id: "c", text: "Saved in the repository" }, { id: "d", text: "On GitHub" }], correct: "b", explanation: "git add stages the change, and it isn't saved in the repository until you commit." },
        { id: "q5", prompt: "Which is the best commit message?", options: [{ id: "a", text: "Add contact form to homepage" }, { id: "b", text: "fixed stuff" }, { id: "c", text: "changes" }, { id: "d", text: "asdf" }], correct: "a", explanation: "A good message is short, starts with a verb, and says what the change does." },
        { id: "q6", prompt: "Which command shows the exact lines you've changed but not yet staged?", options: [{ id: "a", text: "git log" }, { id: "b", text: "git status" }, { id: "c", text: "git diff" }, { id: "d", text: "git diff --staged" }], correct: "c", explanation: "git diff compares your working directory to the staging area, while --staged shows what's already staged." },
        { id: "q7", prompt: "What does git log --oneline show?", options: [{ id: "a", text: "Which files are untracked" }, { id: "b", text: "One line per past commit" }, { id: "c", text: "The contents of the staging area" }, { id: "d", text: "Your Git settings" }], correct: "b", explanation: "git log lists past commits, and --oneline squeezes each one to its short id and message." },
      ],
    },
    {
      id: "undo-and-branch",
      title: "Undoing and Branching",
      description: "Lessons 6–10: .gitignore, undoing changes, branches, merging, and conflicts.",
      questions: [
        { id: "q1", prompt: "Which of these belongs in a .gitignore file?", options: [{ id: "a", text: "index.html" }, { id: "b", text: "node_modules/" }, { id: "c", text: "README.md" }, { id: "d", text: ".gitignore" }], correct: "b", explanation: "Installed packages like node_modules/ can be reinstalled and shouldn't be tracked." },
        { id: "q2", prompt: "You pushed a bad commit that teammates have already pulled. What's the safe way to undo it?", options: [{ id: "a", text: "git reset --soft HEAD~1" }, { id: "b", text: "git restore" }, { id: "c", text: "Delete the .git folder" }, { id: "d", text: "git revert with the commit id" }], correct: "d", explanation: "git revert adds a new commit that reverses the old one, so it doesn't rewrite shared history." },
        { id: "q3", prompt: "What does git reset --soft HEAD~1 do?", options: [{ id: "a", text: "Undoes the last commit but keeps its changes staged" }, { id: "b", text: "Deletes the last commit and all its changes" }, { id: "c", text: "Pushes the last commit to GitHub" }, { id: "d", text: "Creates a new commit that reverses the last one" }], correct: "a", explanation: "The soft reset removes the commit but leaves its changes in the staging area ready to recommit." },
        { id: "q4", prompt: "Which command creates a new branch and switches to it?", options: [{ id: "a", text: "git branch -d add-navbar" }, { id: "b", text: "git merge add-navbar" }, { id: "c", text: "git switch -c add-navbar" }, { id: "d", text: "git switch main" }], correct: "c", explanation: "The -c flag tells git switch to create the branch before switching to it." },
        { id: "q5", prompt: "You want the add-navbar branch merged into main. Which branch should you be on when you run git merge add-navbar?", options: [{ id: "a", text: "add-navbar" }, { id: "b", text: "Any branch" }, { id: "c", text: "A new empty branch" }, { id: "d", text: "main" }], correct: "d", explanation: "git merge brings another branch into the one you're currently on." },
        { id: "q6", prompt: "What is a fast-forward merge?", options: [{ id: "a", text: "A merge that skips conflicts" }, { id: "b", text: "When main hasn't changed, so Git just moves main forward" }, { id: "c", text: "A merge that deletes the feature branch" }, { id: "d", text: "Merging without committing" }], correct: "b", explanation: "If main has no new commits since you branched, Git simply moves main to your branch's latest commit." },
        { id: "q7", prompt: "After editing a conflicted file to the version you want, what do you do next?", options: [{ id: "a", text: "git add the file, then git commit" }, { id: "b", text: "git restore the file" }, { id: "c", text: "Delete the branch and start over" }, { id: "d", text: "git push --force" }], correct: "a", explanation: "Staging the fixed file and committing tells Git the conflict is resolved and finishes the merge." },
      ],
    },
    {
      id: "working-with-others",
      title: "Working with Others",
      description: "Lessons 11–15: remotes, pull requests, forks, rebasing, stashing, and tags.",
      questions: [
        { id: "q1", prompt: "What is the default name for the remote you cloned from?", options: [{ id: "a", text: "main" }, { id: "b", text: "upstream" }, { id: "c", text: "github" }, { id: "d", text: "origin" }], correct: "d", explanation: "Git names the remote origin by default when you clone or when you follow the usual setup." },
        { id: "q2", prompt: "Which command downloads new commits from GitHub into your current branch?", options: [{ id: "a", text: "git push" }, { id: "b", text: "git clone" }, { id: "c", text: "git pull" }, { id: "d", text: "git remote -v" }], correct: "c", explanation: "git pull fetches new commits from the remote and brings them into your branch." },
        { id: "q3", prompt: "A reviewer asks for a change on your open pull request. What do you do?", options: [{ id: "a", text: "Close the PR and open a new one" }, { id: "b", text: "Commit the change and push to the same branch" }, { id: "c", text: "Email the reviewer the file" }, { id: "d", text: "Merge the PR first, then fix it" }], correct: "b", explanation: "Pushing new commits to the PR's branch updates the pull request automatically." },
        { id: "q4", prompt: "In a forked project, what does the upstream remote usually point to?", options: [{ id: "a", text: "The original project you forked from" }, { id: "b", text: "Your fork on GitHub" }, { id: "c", text: "Your local main branch" }, { id: "d", text: "A backup of your .git folder" }], correct: "a", explanation: "You add upstream to track the original project so you can pull its latest changes." },
        { id: "q5", prompt: "When should you avoid rebasing?", options: [{ id: "a", text: "On a local branch nobody else has seen" }, { id: "b", text: "Before opening a pull request" }, { id: "c", text: "On commits other people have already pulled" }, { id: "d", text: "When you want a straight line of history" }], correct: "c", explanation: "Rebasing rewrites commits, which breaks things for anyone who already has the old versions." },
        { id: "q6", prompt: "You have unfinished changes and need to switch branches to fix something urgent. Which command shelves them?", options: [{ id: "a", text: "git tag" }, { id: "b", text: "git revert" }, { id: "c", text: "git rebase --abort" }, { id: "d", text: "git stash" }], correct: "d", explanation: "git stash saves your uncommitted changes and cleans the folder, and git stash pop brings them back." },
        { id: "q7", prompt: "You created the tag v1.0.0 locally. How do you get it onto GitHub?", options: [{ id: "a", text: "It's pushed automatically with your next commit" }, { id: "b", text: "git push origin v1.0.0" }, { id: "c", text: "git pull origin v1.0.0" }, { id: "d", text: "git tag --upload" }], correct: "b", explanation: "Tags aren't pushed by default, so you push each one explicitly." },
      ],
    },
  ],
};

export default gitAndGithub;
