import { db } from "@/db";
import { webhooks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/api/webhooks/:id",
    {
      schema: {
        summary: "Delete a specific webhook by ID",
        tags: ["Webhooks"],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await db.delete(webhooks).where(eq(webhooks.id, id));

      return reply.status(204).send();
    }
  );
};
