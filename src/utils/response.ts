import type { Context } from "hono";

export const sendSuccess = (
  c: Context,
  data: any,
  message = "Success",
  statusCode = 200,
) => {
  return c.json(
    {
      success: true,
      message,
      data,
    },
    statusCode as any,
  );
};

export const sendError = (c: Context, error: Error | any, statusCode = 500) => {
  return c.json(
    {
      success: false,
      message: error.message || "Internal Server Error",
      error: import.meta.env.NODE_ENV === "development" ? error : undefined,
    },
    statusCode as any,
  );
};
