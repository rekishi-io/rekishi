import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodSchema } from "zod";

export function withValidation<T extends ZodSchema>(
  schema: T,
  next: (
    req: Omit<NextApiRequest, "query" | "body"> & z.infer<T>,
    res: NextApiResponse,
  ) => unknown | Promise<unknown>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      });
      return;
    }
    return next(req, res);
  };
}
