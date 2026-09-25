// server.js
// Ephemeral In-Memory SignSense Application & Authentication Server
// Strict Zero-Disk Persistence: All user accounts and sessions reside in RAM only.
// Terminating the process (Ctrl+C) automatically wipes all data without leaving artifacts.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || "8080", 10);

// ============================================================================
// IN-MEMORY STORAGE (RAM ONLY — Zero Disk Persistence)
// ============================================================================
const users = new Map();     // key: lowercase username -> user record
const usersByEmail = new Map(); // key: lowercase email -> username
const sessions = new Map();  // key: sessionId -> { userId, username, email, createdAt }

// Secure password hashing with salt using built-in crypto
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedCombined) {
  const [salt, originalHash] = storedCombined.split(":");
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(originalHash, "hex"));
}

// Generate default blank-slate progress for new learners
function createBlankProgress() {
  return {
    lessonsFinished: [],
    currentLessonId: "fs-1",
    signsLearned: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    refresherSigns: ["A", "E", "I", "B", "C"],
    unlockedUnits: ["fingerspelling"]
  };
}

// MIME types for static asset serving
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

// Helper to parse JSON request bodies
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) { // 1MB limit for safety
        req.destroy();
        reject(new Error("Payload Too Large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

// Helper to extract session from Cookie or Bearer header
function getSession(req) {
  const authHeader = req.headers["authorization"];
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  }

  if (!token && req.headers["cookie"]) {
    const cookies = Object.fromEntries(
      req.headers["cookie"].split(";").map((c) => {
        const [k, v] = c.trim().split("=");
        return [k, decodeURIComponent(v || "")];
      })
    );
    token = cookies["signsense_session"];
  }

  if (!token) return null;
  return sessions.get(token) || null;
}

// ============================================================================
// HTTP REQUEST ROUTER
// ============================================================================
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Security Headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // API ROUTES
  if (pathname.startsWith("/api/")) {
    res.setHeader("Content-Type", "application/json");

    try {
      // POST /api/signup — Register new account from blank slate
      if (method === "POST" && pathname === "/api/signup") {
        const { username, email, password } = await parseBody(req);

        if (!username || !email || !password) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Username, email, and password are required." }));
        }

        const cleanUser = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanUser.length < 3) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Username must be at least 3 characters." }));
        }

        if (password.length < 6) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Password must be at least 6 characters." }));
        }

        if (users.has(cleanUser.toLowerCase())) {
          res.writeHead(409);
          return res.end(JSON.stringify({ error: "That username is already taken." }));
        }

        if (usersByEmail.has(cleanEmail)) {
          res.writeHead(409);
          return res.end(JSON.stringify({ error: "An account with that email already exists." }));
        }

        const passwordHash = hashPassword(password);
        const userId = crypto.randomUUID();
        const newUser = {
          id: userId,
          username: cleanUser,
          email: cleanEmail,
          passwordHash,
          createdAt: new Date().toISOString(),
          progress: createBlankProgress() // Starts completely from scratch!
        };

        users.set(cleanUser.toLowerCase(), newUser);
        usersByEmail.set(cleanEmail, cleanUser.toLowerCase());

        // Create initial session
        const sessionToken = crypto.randomBytes(32).toString("hex");
        sessions.set(sessionToken, {
          userId,
          username: cleanUser,
          email: cleanEmail,
          createdAt: Date.now()
        });

        res.setHeader("Set-Cookie", `signsense_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`);
        res.writeHead(201);
        return res.end(JSON.stringify({
          message: "Account created successfully.",
          user: { id: userId, username: cleanUser, email: cleanEmail },
          progress: newUser.progress,
          token: sessionToken
        }));
      }

      // POST /api/login — Authenticate existing account
      if (method === "POST" && pathname === "/api/login") {
        const { identifier, password } = await parseBody(req);

        if (!identifier || !password) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Username/Email and password are required." }));
        }

        const idClean = identifier.trim().toLowerCase();
        let targetUsername = idClean;
        if (usersByEmail.has(idClean)) {
          targetUsername = usersByEmail.get(idClean);
        }

        const user = users.get(targetUsername);
        if (!user || !verifyPassword(password, user.passwordHash)) {
          res.writeHead(401);
          return res.end(JSON.stringify({ error: "Invalid username or password." }));
        }

        const sessionToken = crypto.randomBytes(32).toString("hex");
        sessions.set(sessionToken, {
          userId: user.id,
          username: user.username,
          email: user.email,
          createdAt: Date.now()
        });

        res.setHeader("Set-Cookie", `signsense_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`);
        res.writeHead(200);
        return res.end(JSON.stringify({
          message: "Logged in successfully.",
          user: { id: user.id, username: user.username, email: user.email },
          progress: user.progress,
          token: sessionToken
        }));
      }

      // GET /api/me — Retrieve active learner profile & progress
      if (method === "GET" && pathname === "/api/me") {
        const session = getSession(req);
        if (!session) {
          res.writeHead(401);
          return res.end(JSON.stringify({ error: "Not logged in" }));
        }

        const user = users.get(session.username.toLowerCase());
        if (!user) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: "User not found" }));
        }

        res.writeHead(200);
        return res.end(JSON.stringify({
          user: { id: user.id, username: user.username, email: user.email },
          progress: user.progress
        }));
      }

      // POST /api/progress — Update progress for current user
      if (method === "POST" && pathname === "/api/progress") {
        const session = getSession(req);
        if (!session) {
          res.writeHead(401);
          return res.end(JSON.stringify({ error: "Not logged in" }));
        }

        const user = users.get(session.username.toLowerCase());
        if (!user) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: "User not found" }));
        }

        const updateData = await parseBody(req);
        user.progress = { ...user.progress, ...updateData };

        res.writeHead(200);
        return res.end(JSON.stringify({
          message: "Progress updated",
          progress: user.progress
        }));
      }

      // POST /api/logout — Terminate active session
      if (method === "POST" && pathname === "/api/logout") {
        const authHeader = req.headers["authorization"];
        let token = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.slice(7).trim();
        }
        if (!token && req.headers["cookie"]) {
          const cookies = Object.fromEntries(
            req.headers["cookie"].split(";").map((c) => {
              const [k, v] = c.trim().split("=");
              return [k, decodeURIComponent(v || "")];
            })
          );
          token = cookies["signsense_session"];
        }

        if (token) {
          sessions.delete(token);
        }

        res.setHeader("Set-Cookie", "signsense_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
        res.writeHead(200);
        return res.end(JSON.stringify({ message: "Logged out successfully." }));
      }

      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Endpoint not found" }));
    } catch (err) {
      console.error("[API Error]", err);
      res.writeHead(500);
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\") {
    safePath = "/index.html";
  }

  const filePath = path.join(__dirname, safePath);

  // Security check: ensure path is within repository root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Support HTTP 206 Partial Content for streaming video (.mp4)
    if (ext === ".mp4" && req.headers.range) {
      const range = req.headers.range;
      const total = stats.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` SignSense Ephemeral Server running at: http://localhost:${PORT}`);
  console.log(` Mode: 100% In-Memory (Zero Disk Writes)`);
  console.log(` Press Ctrl+C at any time to terminate and wipe all memory.`);
  console.log(`======================================================\n`);
});
