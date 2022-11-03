// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from "zod";
import { withMethods } from "lib/api-middleware/with-methods";
import { withValidation } from "lib/api-middleware/with-validation";
import { NextApiHandler } from "next";
import { prisma } from "lib/prisma";

const postHandlerInput = z.object({
  body: z.object({
    organization_id: z.string().min(1),
    name: z.string().optional(),
  }),
});

const postHandlerOutput = z.object({
  organization_id: z.string(),
  name: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  object: z.enum(["organization"]),
});

const postHandler = withValidation(
  postHandlerInput,
  postHandlerOutput,
  async (req, res) => {
    const org = await prisma.organization.upsert({
      where: { org_id: req.body.organization_id },
      create: { org_id: req.body.organization_id, name: req.body.name },
      update: { name: req.body.name },
    });

    // TODO
    if (!org) {
      throw new Error("Create organization failed");
    }

    res.status(200).json({
      organization_id: org.org_id,
      name: org?.name ?? undefined,
      object: "organization",
    });
  },
);

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") return postHandler(req, res);
};

export default withMethods(["GET", "POST"], handler);
