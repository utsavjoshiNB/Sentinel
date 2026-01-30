import pino from "pino";

const isDev = import.meta.env.NODE_ENV !== "production";

export const logger = pino({
  level: import.meta.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  base: {
    env: import.meta.env.NODE_ENV,
  },
});

logger.info("🌲 Logger initialized");
