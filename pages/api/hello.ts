// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../lib/api-middleware/with-methods";
import { withValidation } from "../../lib/api-middleware/with-validation";
import { z } from "zod";

type Data = {
  name: string;
};

const bodySchema = z.object({
  body: z.object({
    title: z.string(),
  }),
});

type BodySchema = z.infer<typeof bodySchema>;

export default withMethods(
  ["GET", "POST"],
  withValidation(bodySchema, (req, res) => {
    res.status(200).json({ name: "John Doe", title: req.body.title });
  }),
);
