# Antigravity Engineering Rules (Codebase Standards)

> "Make it short, simple, fast, scalable."

## 1. Strict Type Safety

- **No `any`**: Explicitly define types/interfaces.
- **No `@ts-ignore`**: Solve the type puzzle; don't bypass it.
- **Why**: "Senior" code is predictable and refactor-safe.

## 2. Optimized Builds

- **Single Binary**: Production artifacts should be compiled singles (e.g., `bun build --compile`).
- **Minimal Images**: Docker images must not contain `node_modules` or `src`.
- **Measurement**: Track build size and start time.

## 3. Structured Capabilities / Logging

- **JSON Logs**: In production, logs must be machine-readable (JSON).
- **Contextual**: Every log entry must include `requestId`, `method`, `path`, and `latency`.
- **Purposeful**: Don't log "here"; log "Processing payment for user X".

## 4. Purposeful Architecture

- **Layered**: Separate `routes`, `middleware`, `lib` (business logic), and `utils`.
- **DRY**: If you copy-paste twice, refactor.
- **Scalable**: Stateless services. Config via environment variables.

## 5. Smooth UX (Optimistic First)

- **Feedback**: Instant clicks. Use `toast` for async results.
- **Loaders**: Skeleton screens > Spinning wheels.
- **Recovery**: If it fails, let the user retry.

## 6. Secure defaults

- **Input Validation**: Validate EVERYTHING (Zod) at the edge.
- **Token Verification**: Verify JWTs on every protected route.
- **Graceful Auth**: Frontend should handle missing keys by warning, not crashing.
