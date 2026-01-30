import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { serveStatic } from "hono/bun";
import { logger } from "./lib/logger";
import { sendSuccess, sendError } from "./utils/response";
import { AppError } from "./utils/AppError";
import { authMiddleware } from "./server/middleware/auth"; // Import middleware
import "./lib/firebase"; // Initialize Firebase

// Define the type for our Hono app variables
type Variables = {
  user: any; // In a real app, define a proper User interface
};

const app = new Hono<{ Variables: Variables }>();

// Middleware
app.use("*", async (c, next) => {
  await next();
  // Required for Google Auth signInWithPopup to work without "window.closed" blocking
  c.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  c.header("Cross-Origin-Embedder-Policy", "unsafe-none");
});

app.use(
  "*",
  pinoLogger({
    pino: logger,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  }),
);

// Public API Routes
app.get("/api/hello", (c) => {
  return sendSuccess(c, { method: "GET" }, "Hello, world!");
});

// Protected API Routes
app.get("/api/me", authMiddleware, (c) => {
  const user = c.get("user");
  return sendSuccess(c, { user }, "You are authenticated!");
});

app.put("/api/hello", (c) => {
  return sendSuccess(c, { method: "PUT" }, "Hello, world!");
});

app.get("/api/hello/:name", (c) => {
  const name = c.req.param("name");
  return sendSuccess(c, { name }, `Hello, ${name}!`);
});

// Serve frontend
app.use("/*", serveStatic({ root: "./dist" }));
app.get("/", serveStatic({ path: "./dist/index.html" }));
app.get("/auth", serveStatic({ path: "./dist/index.html" }));
app.get("*", serveStatic({ path: "./dist/index.html" })); // Catch-all for SPA client-side routing

// Error Handling
app.onError((err, c) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  return sendError(c, err, statusCode);
});

const port = import.meta.env.PORT || 3000;
logger.info(`🚀 Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
