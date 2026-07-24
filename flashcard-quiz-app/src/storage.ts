import type { StudyData, Flashcard, QuizAttempt, QuizHistoryEntry } from "./types";

const STORAGE_KEY = "card-catalog:study-data:v2";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + "T00:00:00");
  const d2 = new Date(b + "T00:00:00");
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

function makeCard(topic: string, question: string, answer: string, explanation?: string): Flashcard {
  return { id: crypto.randomUUID(), topic, question, answer, explanation, createdAt: Date.now() };
}

const SEED_CARDS: Flashcard[] = [
  // ---------- React (15) ----------
  makeCard("React", "Which React hook lets you run side effects after a component renders?", "useEffect", "It runs after the DOM updates, and can clean up between renders or on unmount."),
  makeCard("React", "What special prop should each item in a rendered list have?", "key", "It helps React identify which items changed, were added, or removed, so it can update the DOM efficiently."),
  makeCard("React", "What in-memory structure does React diff against the real DOM to compute minimal updates?", "Virtual DOM", "React diffs it against the previous version to compute the minimal set of real DOM changes needed."),
  makeCard("React", "What hook lets a component hold a mutable value across renders without triggering a re-render?", "useRef", "Commonly used for DOM references or storing values outside state."),
  makeCard("React", "What hook memoizes the result of an expensive calculation?", "useMemo", "It's only recomputed when its dependencies change, avoiding unnecessary recalculation."),
  makeCard("React", "What hook memoizes a function definition itself across renders?", "useCallback", "Useful for preventing unnecessary re-renders of child components relying on referential equality."),
  makeCard("React", "What React API lets you share data across the component tree without prop drilling?", "Context API", "useContext reads from a Provider higher up the tree, avoiding passing props through every level."),
  makeCard("React", "What higher-order component skips re-rendering if props haven't changed?", "React.memo", "A performance optimization that shallow-compares props before deciding to re-render."),
  makeCard("React", "What term describes form inputs whose value is managed by React state?", "Controlled components", "Uncontrolled components instead manage their own state internally, accessed via refs."),
  makeCard("React", "What hook manages local state inside a function component?", "useState", "Returns a state value and a setter function that triggers a re-render when called."),
  makeCard("React", "What rule governs where hooks can be called in a component?", "Only at the top level", "Hooks must not be called conditionally or inside loops, since React relies on call order to track state."),
  makeCard("React", "What browser extension lets you inspect the React component tree and props?", "React DevTools", "It shows the component hierarchy, props, state, and hook values live."),
  makeCard("React", "What React feature groups multiple elements without adding an extra DOM node?", "Fragment", "Written as <React.Fragment> or the shorthand <>...</>."),
  makeCard("React", "What does JSX compile down to under the hood?", "React.createElement calls", "JSX is syntactic sugar for nested calls to React.createElement (or the newer jsx runtime)."),
  makeCard("React", "What term describes passing state and handlers down from a parent so a child stays purely presentational?", "Lifting state up", "Moving shared state to the closest common ancestor so multiple children can read and update it."),

  // ---------- JavaScript (15) ----------
  makeCard("JavaScript", "What operator compares both value and type without coercion?", "===", "== compares after type coercion, while === (strict equality) does not."),
  makeCard("JavaScript", "What term describes a function that retains access to its enclosing scope's variables after that scope has finished executing?", "Closure", "Closures let inner functions 'remember' variables from where they were created."),
  makeCard("JavaScript", "What mechanism lets JavaScript perform non-blocking async work via the call stack and task queues?", "Event loop", "It processes the call stack, then microtasks, then macrotasks, enabling async behavior on a single thread."),
  makeCard("JavaScript", "Which keyword declares a block-scoped variable that can be reassigned?", "let", "Unlike var, let is scoped to the nearest enclosing block, not the whole function."),
  makeCard("JavaScript", "Which keyword declares a block-scoped variable that cannot be reassigned?", "const", "The binding can't be reassigned, though objects/arrays it points to can still be mutated."),
  makeCard("JavaScript", "What behavior moves variable and function declarations to the top of their scope before execution?", "Hoisting", "Declarations are hoisted, but var initializations and let/const stay uninitialized until reached."),
  makeCard("JavaScript", "What method resolves when every promise in an array resolves, or rejects if any one rejects?", "Promise.all", "Useful for running independent async operations in parallel and waiting for all of them."),
  makeCard("JavaScript", "What value represents a variable that has been declared but not yet assigned?", "undefined", "JavaScript automatically assigns this to declared-but-unassigned variables."),
  makeCard("JavaScript", "What value represents an explicit 'no value' assignment?", "null", "Unlike undefined, null is intentionally assigned to mean 'nothing here'."),
  makeCard("JavaScript", "What syntax unpacks values from arrays or object properties into distinct variables?", "Destructuring", "e.g. const { name } = user; or const [first, second] = arr;"),
  makeCard("JavaScript", "What keyword pauses execution of an async function until a promise settles?", "await", "Can only be used inside a function declared with async."),
  makeCard("JavaScript", "What browser storage API persists key-value data even after the tab is closed?", "localStorage", "Unlike sessionStorage, data persists across browser sessions until explicitly cleared."),
  makeCard("JavaScript", "What method converts a JavaScript object into a JSON string?", "JSON.stringify", "Commonly used before sending data over the network or saving to localStorage."),
  makeCard("JavaScript", "What method parses a JSON string back into a JavaScript object?", "JSON.parse", "The inverse of JSON.stringify."),
  makeCard("JavaScript", "What array method creates a new array by transforming every element with a function?", "map", "Unlike forEach, map returns a brand-new array of the same length."),

  // ---------- DSA (15) ----------
  makeCard("DSA", "What is the time complexity of binary search?", "O(log n)", "Each step halves the remaining search space."),
  makeCard("DSA", "Which data structure follows LIFO (last-in, first-out) order?", "Stack", "The last element pushed is the first one popped."),
  makeCard("DSA", "Which data structure follows FIFO (first-in, first-out) order?", "Queue", "The first element added is the first one removed."),
  makeCard("DSA", "What is the average time complexity of a hash table lookup?", "O(1)", "Assuming a good hash function with minimal collisions."),
  makeCard("DSA", "Which graph traversal explores level by level using a queue?", "BFS", "Breadth-First Search is useful for finding the shortest path in an unweighted graph."),
  makeCard("DSA", "Which graph traversal explores as deep as possible along a branch before backtracking?", "DFS", "Depth-First Search typically uses a stack or recursion."),
  makeCard("DSA", "What is quicksort's average-case time complexity?", "O(n log n)", "It degrades to O(n^2) only in the worst case, e.g. with a poor pivot on sorted data."),
  makeCard("DSA", "What is quicksort's worst-case time complexity?", "O(n^2)", "Happens when the pivot repeatedly splits the array very unevenly."),
  makeCard("DSA", "What technique solves problems by breaking them into overlapping subproblems and caching results?", "Dynamic programming", "Avoids recomputation by memoizing or tabulating subproblem answers."),
  makeCard("DSA", "In a binary search tree, which subtree holds values smaller than the node?", "Left subtree", "The right subtree holds larger values, enabling O(log n) average search."),
  makeCard("DSA", "What notation describes the upper-bound growth rate of an algorithm's time or space use?", "Big O notation", "Describes worst-case growth as input size increases, independent of hardware."),
  makeCard("DSA", "What is the time complexity of accessing an array element by index?", "O(1)", "Arrays offer constant-time random access since elements sit at contiguous memory offsets."),
  makeCard("DSA", "What algorithm finds the shortest path in a weighted graph with no negative edge weights?", "Dijkstra's algorithm", "Uses a priority queue to always expand the currently-closest unvisited node."),
  makeCard("DSA", "What data structure is naturally suited to checking balanced parentheses in an expression?", "Stack", "Push opening brackets and pop on closing ones to verify correct nesting."),
  makeCard("DSA", "What is the space complexity of an algorithm using a fixed amount of extra memory regardless of input size?", "O(1)", "Called constant space — it doesn't grow with the size of the input."),

  // ---------- System Design (15) ----------
  makeCard("System Design", "What component distributes incoming traffic across multiple servers?", "Load balancer", "Improves availability and scalability by preventing any single server from being overwhelmed."),
  makeCard("System Design", "What scaling approach adds more machines to share the load?", "Horizontal scaling", "Contrasted with vertical scaling, which adds more resources to one machine."),
  makeCard("System Design", "What scaling approach adds more CPU/RAM to an existing machine?", "Vertical scaling", "Simpler than horizontal scaling but limited by the hardware ceiling of a single machine."),
  makeCard("System Design", "What network of distributed servers caches static assets closer to end users?", "CDN", "A Content Delivery Network reduces latency by serving content from a nearby edge server."),
  makeCard("System Design", "What caching strategy checks the cache first, falls back to the database, then populates the cache?", "Cache-aside", "A common pattern for reducing repeated expensive database reads."),
  makeCard("System Design", "What technique splits a large database into smaller pieces spread across multiple servers?", "Sharding", "Each shard holds a subset of the overall data, improving horizontal scalability."),
  makeCard("System Design", "What type of database favors flexible schemas and horizontal scalability over strict structure?", "NoSQL", "Contrasted with SQL databases, which are relational with fixed schemas."),
  makeCard("System Design", "What mechanism limits how many requests a client can make within a time window?", "Rate limiter", "Protects a service from abuse, overload, or accidental traffic spikes."),
  makeCard("System Design", "What theorem states a distributed system can guarantee only two of Consistency, Availability, and Partition tolerance?", "CAP theorem", "Forces trade-offs when designing distributed databases and services."),
  makeCard("System Design", "What component decouples producers and consumers, enabling asynchronous processing?", "Message queue", "Buffers bursts of traffic and improves overall system resilience."),
  makeCard("System Design", "What term describes verifying who a user is?", "Authentication", "Contrasted with authorization, which determines what they're allowed to do."),
  makeCard("System Design", "What term describes determining what an authenticated user is allowed to do?", "Authorization", "Happens after authentication has confirmed the user's identity."),
  makeCard("System Design", "What pattern copies data across multiple servers to improve availability?", "Replication", "If the primary server fails, a replica can take over with minimal downtime."),
  makeCard("System Design", "What term describes a single component whose failure can take down the entire system?", "Single point of failure", "Good system design aims to eliminate these through redundancy."),
  makeCard("System Design", "What range of HTTP status codes indicates a client-side error?", "4xx", "e.g. 404 Not Found, 401 Unauthorized — as opposed to 5xx for server errors."),

  // ---------- MongoDB (15) ----------
  makeCard("MongoDB", "What kind of database is MongoDB?", "NoSQL document database", "It stores data as flexible, JSON-like BSON documents instead of rows and tables."),
  makeCard("MongoDB", "What is the equivalent of a SQL table called in MongoDB?", "Collection", "A group of documents, typically of similar structure, stored together."),
  makeCard("MongoDB", "What structure improves query speed at the cost of extra storage and slower writes?", "Index", "Speeds up lookups by avoiding a full collection scan."),
  makeCard("MongoDB", "What framework processes documents through stages like $match and $group?", "Aggregation pipeline", "Similar to SQL's GROUP BY and JOIN, used to transform and compute results."),
  makeCard("MongoDB", "What data modeling strategy nests related data directly inside a document?", "Embedding", "Fast to read since related data comes back in one query, but can duplicate data."),
  makeCard("MongoDB", "What data modeling strategy stores an ID pointing to a document in another collection?", "Referencing", "Reduces duplication but requires an extra lookup to resolve the reference."),
  makeCard("MongoDB", "What ODM library adds schemas, validation, and middleware on top of the native MongoDB driver in Node?", "Mongoose", "Provides a more structured object modeling layer for working with MongoDB."),
  makeCard("MongoDB", "What field uniquely identifies every MongoDB document by default?", "_id", "Automatically generated as an ObjectId unless explicitly set."),
  makeCard("MongoDB", "What feature provides high availability via multiple data copies with automatic failover?", "Replica set", "If the primary node goes down, a secondary is automatically promoted."),
  makeCard("MongoDB", "What method returns a cursor to all documents matching a query?", "find()", "Returns a cursor you can iterate, unlike findOne() which returns a single document."),
  makeCard("MongoDB", "What method returns only the first document matching a query?", "findOne()", "Returns null if no document matches."),
  makeCard("MongoDB", "What binary format does MongoDB use internally to store documents?", "BSON", "A binary-encoded superset of JSON that supports more data types like dates and binary data."),
  makeCard("MongoDB", "What method updates a single document matching a filter?", "updateOne", "Takes a filter and an update object describing the changes to apply."),
  makeCard("MongoDB", "What method permanently removes a single document from a collection?", "deleteOne", "Takes a filter to identify which document to remove."),
  makeCard("MongoDB", "What MongoDB feature enforces required fields and data types despite its flexible schema?", "Schema validation", "Lets you add structure and rules on top of an otherwise schema-less collection."),

  // ---------- Node.js & Express (15) ----------
  makeCard("Node.js", "What mechanism makes Node.js non-blocking for I/O operations?", "Event loop", "Handles async I/O in the background via libuv, so the main thread isn't blocked waiting."),
  makeCard("Node.js", "What term describes a function that processes a request before it reaches the route handler in Express?", "Middleware", "Has access to req, res, and next(), and can modify the request or short-circuit the response."),
  makeCard("Node.js", "What file defines a Node project's dependencies, scripts, and metadata?", "package.json", "Lets npm install the correct packages and run defined commands like npm run dev."),
  makeCard("Node.js", "What module system is loaded synchronously at runtime using require()?", "CommonJS", "Contrasted with ES Modules (import/export), which can be statically analyzed."),
  makeCard("Node.js", "What token standard is commonly used for stateless authentication in Node/Express apps?", "JWT", "A signed token is issued on login and verified on each request instead of storing sessions server-side."),
  makeCard("Node.js", "What file stores configuration and secrets outside the codebase?", ".env", "Keeps API keys and database URLs out of source control."),
  makeCard("Node.js", "What browser security mechanism restricts cross-origin requests unless the server explicitly allows them?", "CORS", "Cross-Origin Resource Sharing — configured server-side via response headers."),
  makeCard("Node.js", "What function queues a callback to run immediately after the current operation, before the event loop continues?", "process.nextTick", "Runs before other queued callbacks like those from setImmediate."),
  makeCard("Node.js", "What syntax makes asynchronous code read like synchronous code?", "async/await", "Built on top of Promises, improving readability and enabling try/catch error handling."),
  makeCard("Node.js", "What command installs the dependencies listed in package.json?", "npm install", "Reads package.json (and package-lock.json) to install the exact dependency tree."),
  makeCard("Node.js", "What Express method registers a handler for GET requests on a route?", "app.get", "Takes a path and a handler function, e.g. app.get('/users', handler)."),
  makeCard("Node.js", "What development tool automatically restarts a Node server when files change?", "nodemon", "Watches the file system and restarts the process on save, speeding up development."),
  makeCard("Node.js", "What object in an Express handler represents the incoming HTTP request?", "req", "Contains params, query, body, and headers from the client's request."),
  makeCard("Node.js", "What object in an Express handler represents the outgoing HTTP response?", "res", "Used to send data back, e.g. res.json(), res.status(), res.send()."),
  makeCard("Node.js", "What underlying library gives Node its event-driven, asynchronous I/O engine?", "libuv", "Implements the event loop and handles OS-level async operations across platforms."),

  // ---------- TypeScript (15) ----------
  makeCard("TypeScript", "What does TypeScript add on top of plain JavaScript?", "Static typing", "Types are checked at compile time, catching many bugs before code ever runs."),
  makeCard("TypeScript", "What keyword defines a custom object shape or contract in TypeScript?", "interface", "Describes the expected properties and types an object must have."),
  makeCard("TypeScript", "What symbol marks a property as optional in a TypeScript interface?", "?", "e.g. name?: string means the property may be omitted entirely."),
  makeCard("TypeScript", "What type represents a value that could be anything, bypassing type checking?", "any", "Should be used sparingly since it disables TypeScript's safety checks for that value."),
  makeCard("TypeScript", "What type is safer than any because it requires narrowing before you can use the value?", "unknown", "Forces an explicit type check or assertion before you can operate on the value."),
  makeCard("TypeScript", "What TypeScript feature lets you write reusable components/functions that work across multiple types?", "Generics", "e.g. function identity<T>(arg: T): T { return arg; }"),
  makeCard("TypeScript", "What keyword restricts a variable to one of a fixed set of named values?", "enum", "Defines a set of named constants, e.g. enum Status { Active, Inactive }."),
  makeCard("TypeScript", "What file extension is used for TypeScript files containing JSX/React components?", ".tsx", "Plain TypeScript logic files without JSX use the .ts extension instead."),
  makeCard("TypeScript", "What command type-checks a TypeScript project without emitting any output files?", "tsc --noEmit", "Useful in CI pipelines to verify type correctness without producing build artifacts."),
  makeCard("TypeScript", "What TypeScript feature combines multiple types into one that must satisfy all of them?", "Intersection type", "Written with the & operator, e.g. TypeA & TypeB."),
  makeCard("TypeScript", "What TypeScript feature lets a value be one of several possible types?", "Union type", "Written with the | operator, e.g. string | number."),
  makeCard("TypeScript", "What configuration file controls the TypeScript compiler's behavior and options?", "tsconfig.json", "Specifies things like target JS version, strictness, and included files."),
  makeCard("TypeScript", "What utility type makes every property of a given type optional?", "Partial", "Useful when updating only some fields of an object, e.g. Partial<Flashcard>."),
  makeCard("TypeScript", "What TypeScript concept lets you check a value's type and narrow it inside a conditional block?", "Type guard", "e.g. typeof x === 'string' narrows x to string within that branch."),
  makeCard("TypeScript", "What utility type constructs a type using only a subset of another type's properties?", "Pick", "e.g. Pick<Flashcard, 'id' | 'question'> keeps only those two fields."),

  // ---------- HTML & CSS (15) ----------
  makeCard("HTML & CSS", "What CSS layout model arranges items in a single row or column with flexible sizing?", "Flexbox", "Great for one-dimensional layouts like navbars or button groups."),
  makeCard("HTML & CSS", "What CSS layout model arranges items into rows and columns simultaneously?", "Grid", "Best suited for two-dimensional page layouts."),
  makeCard("HTML & CSS", "What CSS property controls the space between an element's border and its content?", "padding", "Adds internal spacing, pushing content away from the element's edge."),
  makeCard("HTML & CSS", "What CSS property controls the space outside an element's border?", "margin", "Creates spacing between an element and its neighbors."),
  makeCard("HTML & CSS", "What HTML element semantically defines the main navigation links of a page?", "nav", "Helps assistive technologies identify the primary navigation region."),
  makeCard("HTML & CSS", "What CSS pseudo-class styles an element when the mouse is hovering over it?", ":hover", "Commonly used for interactive states on buttons and links."),
  makeCard("HTML & CSS", "What CSS unit is relative to the root element's font size?", "rem", "Unlike em, which is relative to the parent, rem always refers back to the html element."),
  makeCard("HTML & CSS", "What CSS property changes how an element is positioned relative to its normal document flow?", "position", "Values include static, relative, absolute, fixed, and sticky."),
  makeCard("HTML & CSS", "What HTML attribute improves accessibility by describing an image for screen readers?", "alt", "Also displayed if the image fails to load."),
  makeCard("HTML & CSS", "What CSS function returns a value that scales fluidly between a minimum and maximum based on viewport size?", "clamp()", "e.g. font-size: clamp(1rem, 2vw, 1.5rem) enables fluid typography."),
  makeCard("HTML & CSS", "What newer HTML API lets you build a native toggleable menu, like a hamburger nav, without extra JavaScript?", "Popover API", "Provides built-in show/hide behavior and light-dismiss handling for popover elements."),
  makeCard("HTML & CSS", "What naming convention structures CSS classes as Block__Element--Modifier?", "BEM", "Helps keep large stylesheets predictable and avoids specificity clashes."),
  makeCard("HTML & CSS", "What CSS property controls the stacking order of overlapping elements?", "z-index", "Only applies to positioned elements (not position: static)."),
  makeCard("HTML & CSS", "What meta tag makes a page render correctly on mobile device screens?", "viewport meta tag", '<meta name="viewport" content="width=device-width, initial-scale=1.0">'),
  makeCard("HTML & CSS", "What CSS pseudo-element inserts generated content before an element without adding it to the HTML?", "::before", "Commonly paired with the content property to add icons or decorative marks."),

  // ---------- Git & GitHub (15) ----------
  makeCard("Git & GitHub", "What command stages changes for the next commit?", "git add", "Moves changes from the working directory into the staging area."),
  makeCard("Git & GitHub", "What command records staged changes into the repository's history?", "git commit", "Creates a permanent snapshot with a message describing the change."),
  makeCard("Git & GitHub", "What command uploads local commits to a remote repository?", "git push", "Sends your committed changes to the remote, e.g. origin main."),
  makeCard("Git & GitHub", "What command downloads and integrates changes from a remote repository?", "git pull", "Equivalent to running git fetch followed by git merge."),
  makeCard("Git & GitHub", "What command creates a new branch?", "git branch", "Creates the branch but doesn't switch to it — use checkout or switch for that."),
  makeCard("Git & GitHub", "What command switches your working directory to a different branch?", "git checkout", "The newer git switch command does the same thing with a narrower purpose."),
  makeCard("Git & GitHub", "What command combines changes from one branch into another?", "git merge", "Creates a merge commit unless a fast-forward is possible."),
  makeCard("Git & GitHub", "What GitHub feature lets you propose changes and request review before merging?", "Pull request", "Enables code review, discussion, and CI checks before code reaches the main branch."),
  makeCard("Git & GitHub", "What file tells Git which files or folders to exclude from version control?", ".gitignore", "Commonly used to exclude node_modules, build output, and secrets."),
  makeCard("Git & GitHub", "What command shows the commit history of a repository?", "git log", "Can be customized with flags like --oneline or --graph for a compact view."),
  makeCard("Git & GitHub", "What command creates a local copy of a remote repository?", "git clone", "Downloads the full repository history, not just the latest snapshot."),
  makeCard("Git & GitHub", "What term describes when two branches have conflicting changes to the same lines of code?", "Merge conflict", "Git marks the conflicting sections and requires manual resolution before committing."),
  makeCard("Git & GitHub", "What command temporarily shelves uncommitted changes without committing them?", "git stash", "Useful for switching branches quickly without losing in-progress work."),
  makeCard("Git & GitHub", "What command reapplies commits on top of another base branch, rewriting history?", "git rebase", "Produces a cleaner, linear history compared to a merge commit."),
  makeCard("Git & GitHub", "What GitHub feature automates workflows like tests and deployments on push or pull request?", "GitHub Actions", "Defined via YAML workflow files stored in the .github/workflows directory."),

  // ---------- Web Security (15) ----------
  makeCard("Web Security", "What attack injects malicious scripts into web pages viewed by other users?", "XSS", "Cross-Site Scripting — mitigated by escaping/sanitizing user-generated content before rendering."),
  makeCard("Web Security", "What attack tricks a logged-in user's browser into making unwanted requests to another site?", "CSRF", "Cross-Site Request Forgery — mitigated with anti-CSRF tokens or SameSite cookies."),
  makeCard("Web Security", "What attack manipulates a database query by injecting malicious SQL through user input?", "SQL injection", "Prevented by using parameterized queries or an ORM instead of building raw SQL strings."),
  makeCard("Web Security", "What protocol encrypts data in transit between a browser and a server?", "HTTPS", "Uses TLS to prevent eavesdropping and tampering with data on the network."),
  makeCard("Web Security", "What should never be stored in plain text in a database?", "Passwords", "Should always be hashed (and salted) before storage, never stored or logged in plain text."),
  makeCard("Web Security", "What technique transforms a password into a fixed-length, effectively irreversible value before storing it?", "Hashing", "Algorithms like bcrypt are designed to be slow, making brute-force attacks harder."),
  makeCard("Web Security", "What technique adds random data to a password before hashing to defeat rainbow table attacks?", "Salting", "Ensures identical passwords produce different hashes across users."),
  makeCard("Web Security", "What HTTP header restricts which sources a page is allowed to load scripts or styles from?", "Content-Security-Policy", "Helps mitigate XSS by blocking unauthorized script sources."),
  makeCard("Web Security", "What term describes verifying that a user is who they claim to be?", "Authentication", "Typically done via credentials, tokens, or multi-factor verification."),
  makeCard("Web Security", "What token format is commonly used for stateless session authentication in web apps?", "JWT", "A signed token carrying claims, verified on each request without a server-side session store."),
  makeCard("Web Security", "What attack floods a server with traffic from many sources to make it unavailable?", "DDoS attack", "Distributed Denial-of-Service attacks are often mitigated with rate limiting and traffic filtering."),
  makeCard("Web Security", "What cookie flag prevents client-side JavaScript from accessing a cookie's value?", "HttpOnly", "Helps protect session cookies from being stolen via an XSS attack."),
  makeCard("Web Security", "What principle states users and processes should only have the minimum access they need?", "Principle of least privilege", "Limits the damage a compromised account or process can cause."),
  makeCard("Web Security", "What practice checks and cleans all data coming from the client before using it?", "Input validation", "Prevents malformed or malicious input from causing bugs or security issues downstream."),
  makeCard("Web Security", "What cookie attribute helps prevent CSRF by restricting when cookies are sent with cross-site requests?", "SameSite", "Can be set to Strict, Lax, or None depending on how cross-site the cookie should be shared."),
];

function defaultData(): StudyData {
  return {
    cards: SEED_CARDS,
    attempts: [],
    quizHistory: [],
    streak: { current: 0, longest: 0, lastStudyDate: null },
  };
}

export function loadData(): StudyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = defaultData();
      saveData(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as StudyData;
    // Migration guard: older saves (before quiz history was added) won't have this field.
    if (!parsed.quizHistory) parsed.quizHistory = [];
    return parsed;
  } catch {
    return defaultData();
  }
}

export function saveData(data: StudyData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addCard(data: StudyData, card: Omit<Flashcard, "id" | "createdAt">): StudyData {
  const newCard: Flashcard = { ...card, id: crypto.randomUUID(), createdAt: Date.now() };
  const next = { ...data, cards: [newCard, ...data.cards] };
  saveData(next);
  return next;
}

export function updateCard(data: StudyData, id: string, updates: Partial<Flashcard>): StudyData {
  const next = {
    ...data,
    cards: data.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  };
  saveData(next);
  return next;
}

export function deleteCard(data: StudyData, id: string): StudyData {
  const next = { ...data, cards: data.cards.filter((c) => c.id !== id) };
  saveData(next);
  return next;
}

// Records a completed quiz round, updates weekly score log + streak
export function recordAttempt(data: StudyData, correct: number, total: number): StudyData {
  const today = todayStr();
  const attempts: QuizAttempt[] = [...data.attempts];
  const existingIdx = attempts.findIndex((a) => a.date === today);
  if (existingIdx >= 0) {
    attempts[existingIdx] = {
      date: today,
      correct: attempts[existingIdx].correct + correct,
      total: attempts[existingIdx].total + total,
    };
  } else {
    attempts.push({ date: today, correct, total });
  }

  let { current, longest, lastStudyDate } = data.streak;
  if (lastStudyDate === today) {
    // already studied today, streak unchanged
  } else if (lastStudyDate === null) {
    current = 1;
  } else {
    const gap = daysBetween(lastStudyDate, today);
    current = gap === 1 ? current + 1 : 1;
  }
  lastStudyDate = today;
  longest = Math.max(longest, current);

  const next: StudyData = { ...data, attempts, streak: { current, longest, lastStudyDate } };
  saveData(next);
  return next;
}

// Records a completed "Take Quiz" round: updates the same daily/streak stats as
// recordAttempt, plus keeps a standalone timestamped entry in quizHistory.
export function recordQuizAttempt(data: StudyData, correct: number, total: number): StudyData {
  const withDailyStats = recordAttempt(data, correct, total);
  const entry: QuizHistoryEntry = { id: crypto.randomUUID(), timestamp: Date.now(), correct, total };
  const next: StudyData = { ...withDailyStats, quizHistory: [entry, ...withDailyStats.quizHistory] };
  saveData(next);
  return next;
}

// Returns whether today's streak is still "at risk" (not yet studied today)
export function isStreakAtRisk(data: StudyData): boolean {
  if (!data.streak.lastStudyDate) return false;
  return data.streak.lastStudyDate !== todayStr();
}

export function last7DaysAttempts(data: StudyData): QuizAttempt[] {
  const days: QuizAttempt[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const found = data.attempts.find((a) => a.date === dateStr);
    days.push(found ?? { date: dateStr, correct: 0, total: 0 });
  }
  return days;
}

/** Picks `count` random, non-repeating cards from the full deck for a quiz round. */
export function pickRandomQuizCards(cards: Flashcard[], count = 20): Flashcard[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Builds a shuffled list of multiple-choice options for a card: the correct answer
 * plus up to `optionCount - 1` distractors, preferring other answers from the same
 * topic first (so wrong options are plausible), then filling from the rest of the deck.
 */
export function generateOptions(card: Flashcard, allCards: Flashcard[], optionCount = 4): string[] {
  const sameTopicAnswers = Array.from(
    new Set(allCards.filter((c) => c.topic === card.topic && c.id !== card.id).map((c) => c.answer))
  );
  const otherAnswers = Array.from(
    new Set(allCards.filter((c) => c.topic !== card.topic && c.id !== card.id).map((c) => c.answer))
  );

  const distractorsNeeded = optionCount - 1;
  let distractors = shuffleArray(sameTopicAnswers).slice(0, distractorsNeeded);

  if (distractors.length < distractorsNeeded) {
    const fill = shuffleArray(otherAnswers).filter((a) => !distractors.includes(a));
    distractors = [...distractors, ...fill.slice(0, distractorsNeeded - distractors.length)];
  }

  return shuffleArray([card.answer, ...distractors]);
}
