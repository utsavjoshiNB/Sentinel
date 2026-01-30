# Stage 1: Build the application
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency definitions
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend (React)
# This assumes `bun run build` creates the `dist` folder 
# AND we need to compile the server code.
RUN bun run build

# Compile the server into a single binary
RUN bun build --compile --minify --sourcemap src/index.ts --outfile server

# Stage 2: Production image
FROM gcr.io/distroless/base-debian12

WORKDIR /app

# Copy the compiled binary
COPY --from=builder /app/server .
# Copy the built frontend assets
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Run the binary
CMD ["./server"]
