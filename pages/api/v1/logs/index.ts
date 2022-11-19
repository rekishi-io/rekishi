import { z } from "zod";
import { withMethods } from "lib/api-middleware/with-methods";
import { withValidation } from "lib/api-middleware/with-validation";
import { NextApiHandler } from "next";
import { prisma } from "lib/prisma";

const logsPostHandlerInput = z.object({
  body: z.object({}),
});

const logsPostHandlerOutput = z.object({});

const postHandler = withValidation(
  logsPostHandlerInput,
  logsPostHandlerOutput,
  async (req, res) => {},
);

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") return postHandler(req, res);
};

export default withMethods(["POST"], handler);
