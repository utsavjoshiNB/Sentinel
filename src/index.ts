import { serveStatic } from "hono/bun";
import { logger } from "./lib/logger";
import app from "./server/app";

// Serve frontend (Local Development Only)
// In Vercel, this will be handled by the 'public' directory or static output
app.use("/*", serveStatic({ root: "./dist" }));
app.get("/", serveStatic({ path: "./dist/index.html" }));
app.get("/auth", serveStatic({ path: "./dist/index.html" }));
app.get("*", serveStatic({ path: "./dist/index.html" })); // Catch-all for SPA client-side routing

const port = import.meta.env.PORT || 3000;
logger.info(`🚀 Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
