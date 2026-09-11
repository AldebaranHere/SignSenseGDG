// server.js
// A simple, beginner-friendly authentication server.
// It handles: SIGN UP -> SIGN IN -> remembers you (session) -> HOME PAGE

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "data", "users.json");

// --- Middleware ---
app.use(express.json()); // lets us read JSON sent from the browser
app.use(express.static(path.join(__dirname, "public"))); // serves our HTML/CSS/JS pages

app.use(
  session({
    secret: "change-this-to-a-random-secret-in-production", // used to sign the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // session lasts 1 day
    },
  })
);

// --- Tiny "database" helpers (a JSON file on disk) ---
// This is the simplest possible way to persist users between server restarts.
// For a real production app you'd swap this for a real database (Postgres, MySQL, etc.)
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
  const raw = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- Middleware to protect routes that require login ---
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

// ============ API ROUTES ============

// SIGN UP: create a new account
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const users = readUsers();

  const existing = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: "Username or email is already registered." });
  }

  // NEVER store plain-text passwords. We hash it first.
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: "Account created successfully." });
});

// SIGN IN: check credentials and start a session ("remember" the login)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const users = readUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  // This is what "remembers" the user: we store their id in the session,
  // and the browser keeps a session cookie so future requests are recognized.
  req.session.userId = user.id;
  req.session.username = user.username;

  res.json({ message: "Logged in successfully." });
});

// Check who's currently logged in (used by home.html on page load)
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ username: req.session.username });
});

// LOG OUT
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out." });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
