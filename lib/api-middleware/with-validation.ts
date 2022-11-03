import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodSchema } from "zod";

export function withValidation<T extends ZodSchema, U extends ZodSchema>(
  input: T,
  output: U,
  next: (
    req: Omit<NextApiRequest, "query" | "body"> & z.infer<T>,
    res: NextApiResponse<z.infer<U>>,
  ) => unknown | Promise<unknown>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = input.safeParse(req);
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
