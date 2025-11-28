import { db } from "@/db";
import { webhooks } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    "/capture/*",
    {
      schema: {
        summary: "Capture incoming webhook requests",
        tags: ["External"],
        hide: true,
        response: {
          201: z.object({
            id: z.uuidv7(),
          }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method;
      const ip = request.ip;
      const pathName = new URL(request.url).pathname.replace("/capture", "");
      const contentType = request.headers["content-type"];
      const contentLength = request.headers["content-length"]
        ? Number(request.headers["content-length"])
        : null;

      let body: string | null = null;
      const headers = Object.fromEntries(
        Object.entries(request.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(", ") : value || "",
        ])
      );

      if (request.body) {
        if (typeof request.body === "string") {
          body = request.body;
        } else {
          body = JSON.stringify(request.body, null, 2);
        }
      }

      const result = await db
        .insert(webhooks)
        .values({
          method,
          pathName,
          body,
          headers,
          ip,
          contentType,
          contentLength,
        })
        .returning();

      return reply.send({ id: result[0].id });
    }
  );
};
