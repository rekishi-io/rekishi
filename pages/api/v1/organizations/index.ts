// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from "zod";
import { withMethods } from "lib/api-middleware/with-methods";
import { withValidation } from "lib/api-middleware/with-validation";
import { NextApiHandler } from "next";

const postHandlerInput = z.object({
  body: z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
});

const postHandlerOutput = z.object({
  id: z.string(),
  name: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

const postHandler = withValidation(
  postHandlerInput,
  postHandlerOutput,
  (req, res) => {
    res.status(200).json({ id: "id_1" });
  },
);

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") return postHandler(req, res);
};

export default withMethods(["GET", "POST"], handler);
