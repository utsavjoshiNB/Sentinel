import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { sendError } from "../../utils/response";
import { AppError } from "../../utils/AppError";

// Cache Google's public keys
const FIREBASE_JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
);
const JWKS = createRemoteJWKSet(FIREBASE_JWKS_URL);

/**
 * Verifies a Firebase ID Token.
 * - In Mock Mode (dev): Allows a specific mock token.
 * - In Production: Verifies signature against Google's public certs.
 */
export const authMiddleware: MiddlewareHandler = createMiddleware(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: Missing Bearer Token", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Unauthorized: Invalid Token", 401);
    }

    // MOCK VERIFICATION (Development Only)
    if (
      import.meta.env.NODE_ENV !== "production" &&
      (token === "mock-token" || token.startsWith("mock-"))
    ) {
      c.set("user", {
        uid: "mock-user-123",
        email: "mock@example.com",
        provider: "mock",
      });
      await next();
      return;
    }

    // REAL VERIFICATION
    try {
      const projectId = import.meta.env.FIREBASE_PROJECT_ID || "mock-project";

      // Verify the token signature and expiration
      const result = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });

      c.set("user", result.payload);
      await next();
    } catch (err: any) {
      // If we are in dev and verification fails (e.g. valid token but wrong project ID in env), log warning but maybe fail?
      // "Senior" decision: Fail secure.
      console.error("JWT Verification failed:", err.message);
      throw new AppError("Unauthorized: Invalid Token Signature", 401);
    }
  },
);
