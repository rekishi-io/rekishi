// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from "zod";
import { withMethods } from "lib/api-middleware/with-methods";
import { withValidation } from "lib/api-middleware/with-validation";
import { NextApiHandler } from "next";
import { prisma } from "lib/prisma";

const postHandlerInput = z.object({
  body: z.object({
    organization_id: z.string().min(1),
    user_id: z.string().min(1),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }),
});

export type PostHandlerInput = z.infer<typeof postHandlerInput>;

const postHandlerOutput = z.object({
  organization_id: z.string(),
  user_id: z.string().min(1),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  object: z.enum(["user"]),
});

const postHandler = withValidation(
  postHandlerInput,
  postHandlerOutput,
  async (req, res) => {
    const org = await prisma.organization.findUnique({
      where: { org_id: req.body.organization_id },
    });

    // TODO
    if (!org) {
      throw new Error("org not found");
    }

    const user = await prisma.user.upsert({
      where: { user_id: req.body.user_id },
      create: {
        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        organizationId: org.id,
      },
      update: {
        name: req.body.name,
        email: req.body.email,
      },
    });

    // TODO
    if (!user) {
      throw new Error("Create organization failed");
    }

    res.status(200).json({
      object: "user",
      organization_id: org.org_id,
      user_id: user.user_id,
      email: user.email ?? undefined,
      name: user.name ?? undefined,
    });
  },
);

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") return postHandler(req, res);
};

export default withMethods(["POST"], handler);
