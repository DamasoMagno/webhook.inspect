import { fastify } from "fastify";
import {
  serializerCompiler,
  jsonSchemaTransform,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";

import { listWebhooks } from "./routes/list-webhooks";
import { env } from "./env";
import { captureWebhook } from "./routes/capture-webhook";
import { deleteWebhook } from "./routes/delete-webhook";
import { getWebhook } from "./routes/get-webhook";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "PUT", "PATCH", "DELETE", "POST", "OPTIONS"],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Inspector API",
      description: "API for capturing and inspecting webhook requests",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(listWebhooks);
app.register(captureWebhook);
app.register(deleteWebhook);
app.register(getWebhook);

app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Docs available at http://localhost:${env.PORT}/docs`);
  });
