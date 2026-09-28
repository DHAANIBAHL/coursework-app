const cloudAndDeployment = {
  slug: "cloud-and-deployment",
  tag: "DevOps",
  title: "Cloud Computing & Deployment",
  image: "/images/Cloud Computing.png",
  color: "bg-cyan-700",
  description: "What the cloud really is, how to get your app onto it, and how to keep it running once real people use it.",
  lessons: [
    {
      title: "What the Cloud Is",
      body: "The cloud is computers, storage, and networks you rent from a provider over the internet instead of buying and running yourself. Providers like AWS, Google Cloud, Azure, and DigitalOcean run huge data centers and let you use a slice of them in minutes.",
      code: `# Before the cloud: buy a server, set it up, wait weeks
# With the cloud: rent one in minutes, return it when done

# The main things you rent:
#   compute   -> machines that run your code
#   storage   -> space for files, images, and backups
#   databases -> data storage someone else maintains
#   network   -> addresses, domains, and traffic routing

# You pay for what you use, while you use it.`,
      after: "Anything you leave running keeps costing money, so shut down what you're not using.",
    },
    {
      title: "IaaS, PaaS, and SaaS",
      body: "Cloud services come in layers based on how much the provider manages for you. IaaS gives you raw machines, PaaS runs your code for you, and SaaS is a finished app you simply use.",
      code: `# Who manages each layer?
#
#          Your code   Runtime    OS         Hardware
# IaaS     you         you        you        provider
# PaaS     you         provider   provider   provider
# SaaS     provider    provider   provider   provider
#
# IaaS: virtual machines (EC2, Compute Engine, Azure VMs)
# PaaS: push code and it runs (Render, Heroku, App Engine)
# SaaS: apps you just log into (Gmail, Slack, Notion)`,
      after: "Beginners usually ship faster on PaaS, since there's no operating system to look after.",
    },
    {
      title: "Regions and Availability Zones",
      body: "A region is a geographic area where a provider has data centers, such as eastern US or western Europe. Each region is split into availability zones, separate data centers with their own power and networking, so a problem in one doesn't knock out the others.",
      code: `# Illustrative config, not a real provider's format
region: us-east        # pick one close to your users
zones:
  - us-east-a          # separate buildings, power, and network
  - us-east-b
  - us-east-c

# Run copies in two zones so one outage doesn't take you down
app:
  replicas: 2
  spread_across_zones: true`,
      after: "Choose a region near most of your users, because distance adds delay to every request.",
    },
    {
      title: "Virtual Machines",
      body: "A virtual machine (VM) is a computer that exists as software on a provider's hardware. You pick its CPU, memory, and operating system, then connect with SSH and use it like any Linux machine.",
      code: `# Connect to your new VM with SSH
ssh -i ~/.ssh/my-key.pem ubuntu@203.0.113.10

# Once inside, it's a normal Linux machine
sudo apt update
sudo apt install -y nodejs npm
git clone https://github.com/you/my-app.git
cd my-app && npm install
node app.js`,
      after: "On a VM, security updates and patches are your job, just like on your own computer.",
    },
    {
      title: "Storage: Object and Block",
      body: "Object storage keeps files in buckets and hands them back by name over HTTP, which suits images, uploads, and backups. Block storage is a virtual disk attached to one machine and used like a hard drive, which suits databases and anything that needs a real file system.",
      code: `# Object storage: upload a file to a bucket, fetch it by its key
aws s3 cp logo.png s3://my-app-assets/images/logo.png
gcloud storage cp logo.png gs://my-app-assets/images/logo.png

# Block storage: a disk attached to one VM
lsblk                          # list attached disks
sudo mkfs -t ext4 /dev/sdb     # format the new disk (erases it!)
sudo mkdir /data
sudo mount /dev/sdb /data      # /data now lives on that disk`,
      after: "Store user uploads in a bucket, not on the server's own disk, so they survive if the server is replaced.",
    },
    {
      title: "Managed Databases",
      body: "A managed database is one the provider runs for you, handling backups, updates, and failover. Services like Amazon RDS, Google Cloud SQL, and Azure Database give you a connection address, and your code connects to it the same way it connects to a local database.",
      code: `# The provider gives you a host, port, user, and password
DATABASE_URL=mysql://app_user:s3cret@db.example.com:3306/coursework

// app.js — connect the same way you would locally
import mysql from "mysql2/promise";

const db = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await db.query("SELECT NOW() AS now");
console.log(rows[0].now);`,
      after: "Lock the database down so only your app's servers can reach it, never the whole internet.",
    },
    {
      title: "Networking Basics",
      body: "Every server has an IP address, and a port picks which program on that machine answers. DNS turns a friendly domain name into an IP address, and a load balancer sits in front of several servers and spreads incoming traffic across them.",
      code: `# DNS turns a name into an IP address
nslookup myapp.com
# -> 203.0.113.10

# A port picks which program on that machine answers
# 22 = SSH, 80 = HTTP, 443 = HTTPS, 3000 = a dev server

# DNS records for your domain
# Type   Name   Value
# A      @      203.0.113.10   (the load balancer's IP)
# CNAME  www    myapp.com`,
      after: "DNS changes can take a while to spread, so don't panic if a new domain doesn't work right away.",
    },
    {
      title: "Environment Variables and Secrets in Production",
      body: "In production there's no .env file from your laptop, so you set environment variables in your host's dashboard or CLI instead. Real secrets like database passwords can live in a secrets manager such as AWS Secrets Manager, Google Secret Manager, or Azure Key Vault.",
      code: `// config.js — read settings, and fail fast if one is missing
const required = ["DATABASE_URL", "JWT_SECRET"];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(\`Missing environment variable: \${name}\`);
  }
}

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};`,
      after: "Checking settings at startup means a missing secret fails right away instead of halfway through a user's request.",
    },
    {
      title: "Building a Frontend for Production",
      body: "The dev server is built for fast editing, not for real visitors. A production build bundles and minifies your code into plain HTML, CSS, and JavaScript files that any web server can send.",
      code: `npm run build

# Vite writes optimized files to dist/
# dist/
#   index.html
#   assets/index-4f8a2c.js    (minified, hashed name)
#   assets/index-9b1d3e.css

# Values baked in at build time must start with VITE_
# VITE_API_URL=https://api.myapp.com

npm run preview   # try the production build locally`,
      after: "Everything in a frontend build is public, so never put secrets in VITE_ variables.",
    },
    {
      title: "Deploying a Static Site",
      body: "A built frontend is just files, so it can be served by a static host like Netlify, Vercel, Cloudflare Pages, or GitHub Pages, or from a bucket behind a CDN. Single-page apps need one extra rule so every path serves index.html and the router can take over.",
      code: `# Option 1: a static host's CLI
npm run build
npx netlify-cli deploy --dir=dist --prod

# Option 2: a bucket behind a CDN
aws s3 sync dist/ s3://my-site-bucket --delete

# Without a rewrite, refreshing /course/react gives a 404.
# Netlify-style rule in public/_redirects:
/*    /index.html   200`,
      after: "Most static hosts can also deploy automatically every time you push to GitHub.",
    },
    {
      title: "Deploying a Node API",
      body: "An API needs a machine that keeps running, such as a PaaS like Render, Railway, Fly.io, or Heroku, or a VM you manage. PaaS hosts usually run npm start and tell your app which port to use through the PORT variable.",
      code: `// app.js — the host tells you which port to use
const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0", () => {
  console.log(\`API listening on \${port}\`);
});

// package.json — the host runs "npm start"
"scripts": { "start": "node app.js" }

# On your own VM, keep it running after you log out
npm install -g pm2
pm2 start app.js --name api
pm2 save`,
      after: "Hard-coding port 3000 is a common reason a deployed app never answers.",
    },
    {
      title: "Containers and Docker Basics",
      body: "A container packages your app with everything it needs to run, so it behaves the same on your laptop and in the cloud. A Dockerfile is the recipe: Docker follows it to build an image, and each running copy of that image is a container.",
      code: `# Dockerfile
FROM node:lts-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
EXPOSE 4000
CMD ["node", "app.js"]

# Build the image, then run a container from it
docker build -t my-api .
docker run -p 4000:4000 --env-file .env my-api`,
      after: "Copying package.json before the rest of the code lets Docker reuse the cached npm install when only your code changes.",
    },
    {
      title: "Docker Compose for App and Database",
      body: "Docker Compose starts several containers together from one file, such as your API and its database. Each service can reach the others by its service name, so the API connects to a host called db.",
      code: `# compose.yaml — start everything with: docker compose up
services:
  api:
    build: .
    ports: ["4000:4000"]
    environment:
      DATABASE_URL: mysql://root:devpass@db:3306/coursework
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: devpass
      MYSQL_DATABASE: coursework
    volumes: ["db-data:/var/lib/mysql"]
volumes:
  db-data:`,
      after: "The named volume keeps your database's data when the container is stopped or rebuilt.",
    },
    {
      title: "Serverless Functions",
      body: "Serverless functions let you deploy a single function instead of a whole server. The provider runs it only when a request arrives, scales it automatically, and charges per call, as with AWS Lambda, Google Cloud Functions, Azure Functions, or Cloudflare Workers.",
      code: `// api/hello.js — one function, one URL, no server to manage
// (the exact handler shape varies by provider)
export default async function handler(request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name") || "world";

  return new Response(JSON.stringify({ message: \`Hello, \${name}\` }), {
    headers: { "Content-Type": "application/json" },
  });
}

// Deployed, it answers at something like:
// https://myapp.example.com/api/hello?name=Sam`,
      after: "A function that hasn't run recently can take a moment to wake up, which is called a cold start.",
    },
    {
      title: "CI/CD with a Pipeline",
      body: "CI/CD means a pipeline checks and deploys your code automatically every time you push. GitHub Actions, GitLab CI, and similar tools run the steps you list in a file, and stop if any step fails.",
      code: `# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "lts/*" }
      - run: npm ci && npm run lint && npm run build
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`,
      after: "Store tokens in the repository's secrets settings and read them with ${{ secrets.NAME }}, never in the workflow file itself.",
    },
    {
      title: "Logs and Monitoring",
      body: "Once your app is live, logs are how you find out what happened and monitoring tells you when something is wrong. Tools like CloudWatch, Google Cloud Logging, Azure Monitor, Datadog, and Grafana collect your output and can alert you on errors or downtime.",
      code: `// Log one JSON line per event so tools can search and filter it
function log(level, message, extra = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), level, message, ...extra }));
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    log("info", "request", { method: req.method, url: req.url, status: res.statusCode, ms: Date.now() - start });
  });
  next();
});

// A health check that uptime monitors can ping
app.get("/health", (req, res) => res.json({ ok: true }));`,
      after: "Never log passwords, tokens, or other secrets, since logs are read by more people and tools than you'd expect.",
    },
    {
      title: "Scaling Your App",
      body: "Vertical scaling means moving to a bigger machine, and horizontal scaling means running more machines behind a load balancer. Autoscaling adds and removes machines for you based on rules like CPU usage, so you only pay for extra capacity when traffic needs it.",
      code: `# Vertical: a bigger machine (more CPU and memory)
#   1 server x 2 CPUs  ->  1 server x 8 CPUs

# Horizontal: more machines behind a load balancer
#   1 server  ->  4 servers

# Autoscaling rule (illustrative config)
autoscaling:
  min_instances: 2
  max_instances: 10
  scale_out_when: cpu_above_70_percent
  scale_in_when: cpu_below_30_percent`,
      after: "Horizontal scaling only works if servers keep no state in memory, so store sessions in cookies or a database.",
    },
    {
      title: "Cost Awareness and Security Basics",
      body: "Set a budget alert with your provider and delete resources you no longer use, because forgotten servers and databases keep billing. For security, follow least privilege by giving every key and account only the permissions it needs, and serve everything over HTTPS.",
      code: `# Least privilege: a deploy key that can only upload to one bucket
# (AWS-style policy; other clouds use the same idea)
{
  "Effect": "Allow",
  "Action": ["s3:PutObject"],
  "Resource": "arn:aws:s3:::my-site-bucket/*"
}

# Redirect all plain HTTP traffic to HTTPS (nginx)
server {
  listen 80;
  server_name myapp.com;
  return 301 https://$host$request_uri;
}`,
      after: "Most hosts and load balancers give you free HTTPS certificates, so there's no reason to serve plain HTTP.",
    },
  ],
  quizzes: [
    {
      id: "cloud-foundations",
      title: "Cloud Foundations",
      description: "Lessons 1–6: what the cloud is, service models, regions, virtual machines, storage, and managed databases.",
      questions: [
        { id: "q1", prompt: "What does \"the cloud\" mostly mean?", options: [{ id: "a", text: "Computing resources you rent from a provider over the internet" }, { id: "b", text: "A folder that syncs between your devices" }, { id: "c", text: "A type of database" }, { id: "d", text: "Software that only runs in the browser" }], correct: "a", explanation: "The cloud is compute, storage, and networking you rent from a provider instead of running your own hardware." },
        { id: "q2", prompt: "Which of these is an example of PaaS?", options: [{ id: "a", text: "Renting a raw virtual machine" }, { id: "b", text: "Logging into Gmail" }, { id: "c", text: "Pushing your code and letting the platform run it" }, { id: "d", text: "Buying a server for your office" }], correct: "c", explanation: "With PaaS you bring the code and the provider manages the runtime, OS, and hardware." },
        { id: "q3", prompt: "Why run copies of your app in two availability zones?", options: [{ id: "a", text: "It makes the app load faster everywhere in the world" }, { id: "b", text: "So an outage in one data center doesn't take the app down" }, { id: "c", text: "It is required to use a custom domain" }, { id: "d", text: "It halves your bill" }], correct: "b", explanation: "Zones are separate data centers with their own power and networking, so a problem in one leaves the others running." },
        { id: "q4", prompt: "On a virtual machine you rent, who is responsible for installing security updates?", options: [{ id: "a", text: "The provider, automatically" }, { id: "b", text: "Nobody, VMs don't need updates" }, { id: "c", text: "Your users" }, { id: "d", text: "You" }], correct: "d", explanation: "A VM is like your own computer: patching the operating system is your job." },
        { id: "q5", prompt: "Where is the best place to keep images that users upload?", options: [{ id: "a", text: "In the server's own disk folder" }, { id: "b", text: "In an object storage bucket" }, { id: "c", text: "Inside the frontend build" }, { id: "d", text: "In an environment variable" }], correct: "b", explanation: "Buckets keep files safe even if the server is replaced, and serve them back by name." },
        { id: "q6", prompt: "What is block storage?", options: [{ id: "a", text: "A bucket that serves files over HTTP" }, { id: "b", text: "A list of blocked IP addresses" }, { id: "c", text: "A spreadsheet of your cloud costs" }, { id: "d", text: "A virtual disk attached to one machine, used like a hard drive" }], correct: "d", explanation: "Block storage acts like a hard drive for a single machine, which suits databases and file systems." },
        { id: "q7", prompt: "What is the main benefit of a managed database?", options: [{ id: "a", text: "It never needs a password" }, { id: "b", text: "It can only be reached from the internet" }, { id: "c", text: "The provider handles backups, updates, and failover" }, { id: "d", text: "It stores data in your frontend" }], correct: "c", explanation: "A managed database takes the maintenance work off your hands while your code connects to it normally." },
      ],
    },
    {
      id: "networking-and-deploying",
      title: "Networking and Deploying",
      description: "Lessons 7–12: networking, production secrets, frontend builds, static sites, Node APIs, and Docker.",
      questions: [
        { id: "q1", prompt: "What does DNS do?", options: [{ id: "a", text: "Turns a domain name into an IP address" }, { id: "b", text: "Encrypts traffic between browser and server" }, { id: "c", text: "Spreads traffic across servers" }, { id: "d", text: "Stores your database backups" }], correct: "a", explanation: "DNS looks up the IP address behind a friendly name like myapp.com." },
        { id: "q2", prompt: "Which port is normally used for HTTPS?", options: [{ id: "a", text: "22" }, { id: "b", text: "80" }, { id: "c", text: "443" }, { id: "d", text: "3000" }], correct: "c", explanation: "443 is HTTPS, while 80 is plain HTTP and 22 is SSH." },
        { id: "q3", prompt: "What does a load balancer do?", options: [{ id: "a", text: "Turns domain names into IP addresses" }, { id: "b", text: "Spreads incoming traffic across several servers" }, { id: "c", text: "Compresses your JavaScript bundle" }, { id: "d", text: "Backs up your database every night" }], correct: "b", explanation: "A load balancer sits in front of your servers and shares requests between them." },
        { id: "q4", prompt: "Why should a config file throw an error at startup if a required variable is missing?", options: [{ id: "a", text: "It makes the app start faster" }, { id: "b", text: "Hosts require it" }, { id: "c", text: "It hides the variable from the logs" }, { id: "d", text: "So the problem shows up immediately instead of halfway through a request" }], correct: "d", explanation: "Failing fast makes a missing secret obvious right when you deploy." },
        { id: "q5", prompt: "Why must you never put secrets in VITE_ variables?", options: [{ id: "a", text: "Everything in a frontend build is public" }, { id: "b", text: "Vite deletes them during the build" }, { id: "c", text: "They only work in development" }, { id: "d", text: "They make the build fail" }], correct: "a", explanation: "VITE_ values are baked into JavaScript files that every visitor downloads." },
        { id: "q6", prompt: "Refreshing /course/react on a deployed single-page app shows a 404. What fixes it?", options: [{ id: "a", text: "Rebuilding the app with npm run dev" }, { id: "b", text: "Moving the site to a VM" }, { id: "c", text: "A rewrite rule so every path serves index.html" }, { id: "d", text: "Adding a VITE_ variable" }], correct: "c", explanation: "The host must hand every path to index.html so the frontend router can take over." },
        { id: "q7", prompt: "Why should a deployed Node API listen on process.env.PORT?", options: [{ id: "a", text: "Port 3000 is blocked by browsers" }, { id: "b", text: "The host tells your app which port to use through it" }, { id: "c", text: "It turns on HTTPS automatically" }, { id: "d", text: "npm start requires it" }], correct: "b", explanation: "Hosts pick the port and pass it in PORT, so a hard-coded port may never receive traffic." },
        { id: "q8", prompt: "Why does a Dockerfile copy package.json before copying the rest of the code?", options: [{ id: "a", text: "Docker can't copy more than one file at a time" }, { id: "b", text: "It makes the image public" }, { id: "c", text: "It skips installing dependencies" }, { id: "d", text: "So Docker can reuse the cached npm install when only your code changes" }], correct: "d", explanation: "The install step is only rerun when package.json changes, which speeds up rebuilds." },
      ],
    },
    {
      id: "running-in-production",
      title: "Running in Production",
      description: "Lessons 13–18: Docker Compose, serverless, CI/CD, logs and monitoring, scaling, and cost and security.",
      questions: [
        { id: "q1", prompt: "In a compose file with services api and db, how does the API reach the database?", options: [{ id: "a", text: "Through localhost" }, { id: "b", text: "By using db as the host name" }, { id: "c", text: "Through a public IP address" }, { id: "d", text: "It can't; they need separate compose files" }], correct: "b", explanation: "Compose lets each service reach the others by its service name." },
        { id: "q2", prompt: "Why give the database service a named volume?", options: [{ id: "a", text: "So its data survives when the container is stopped or rebuilt" }, { id: "b", text: "So it starts before the API" }, { id: "c", text: "So it gets a public URL" }, { id: "d", text: "So it uses less memory" }], correct: "a", explanation: "Without a volume, the database's data disappears along with the container." },
        { id: "q3", prompt: "What best describes serverless functions?", options: [{ id: "a", text: "Code that runs with no computers involved" }, { id: "b", text: "A VM you manage yourself" }, { id: "c", text: "Functions the provider runs on request, scales automatically, and charges per call" }, { id: "d", text: "A way to build a frontend" }], correct: "c", explanation: "Servers still exist, but the provider runs and scales them so you only deploy the function." },
        { id: "q4", prompt: "What is a cold start?", options: [{ id: "a", text: "Restarting a VM after an update" }, { id: "b", text: "The first deploy of a new project" }, { id: "c", text: "Starting a database with no data" }, { id: "d", text: "A delay when a function that hasn't run recently wakes up" }], correct: "d", explanation: "An idle function takes a moment to spin up before it can answer the first request." },
        { id: "q5", prompt: "In a GitHub Actions workflow, where should a deploy token live?", options: [{ id: "a", text: "In the repository's secrets, read with secrets.DEPLOY_TOKEN" }, { id: "b", text: "Typed directly into the workflow file" }, { id: "c", text: "In a VITE_ variable" }, { id: "d", text: "In a comment in deploy.sh" }], correct: "a", explanation: "Repository secrets keep the token out of your code while the pipeline can still use it." },
        { id: "q6", prompt: "Why log one JSON line per event?", options: [{ id: "a", text: "JSON logs take up no space" }, { id: "b", text: "It hides errors from users" }, { id: "c", text: "Logging tools can search and filter it easily" }, { id: "d", text: "Browsers require it" }], correct: "c", explanation: "Structured logs let monitoring tools find and filter events by field." },
        { id: "q7", prompt: "What is horizontal scaling?", options: [{ id: "a", text: "Moving to a machine with more CPU and memory" }, { id: "b", text: "Running more machines behind a load balancer" }, { id: "c", text: "Splitting your frontend into more files" }, { id: "d", text: "Moving to a different region" }], correct: "b", explanation: "Horizontal scaling adds machines, while vertical scaling makes one machine bigger." },
        { id: "q8", prompt: "What does the principle of least privilege mean?", options: [{ id: "a", text: "Only admins can deploy" }, { id: "b", text: "Use the cheapest machine size" }, { id: "c", text: "Serve everything over HTTP" }, { id: "d", text: "Give each key and account only the permissions it needs" }], correct: "d", explanation: "Limiting permissions means a leaked key can do as little damage as possible." },
      ],
    },
  ],
};

export default cloudAndDeployment;
