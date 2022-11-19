import { z } from "zod";
import { withMethods } from "lib/api-middleware/with-methods";
import { withValidation } from "lib/api-middleware/with-validation";
import { NextApiHandler } from "next";
import { prisma } from "lib/prisma";

const logsPostHandlerInput = z.object({
  body: z.object({
    organization_id: z.string().min(1),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    event: z.object({
      action: z.string(),
      actor: z.object({
        id: z.string().min(1),
      }),
      targets: z.array(
        z.object({
          type: z.string(),
          id: z.string().min(1),
        }),
      ),
      context: z
        .object({
          location: z.string(),
          user_agenet: z.string(),
        })
        .optional(),
      metaData: z.object({}).optional(),
    }),
  }),
});

const logsPostHandlerOutput = z.object({});

const postHandler = withValidation(
  logsPostHandlerInput,
  logsPostHandlerOutput,
  async (req, res) => {
    const org = await prisma.organization.findUnique({
      where: { org_id: req.body.organization_id },
    });

    // TODO
    if (!org) throw new Error("Organization not found.");

    const log = await prisma.log.create({ data: {} });

    res.json(log);
  },
);

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") return postHandler(req, res);
};

export default withMethods(["POST"], handler);
