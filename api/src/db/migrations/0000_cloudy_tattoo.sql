CREATE TABLE "webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"path_name" text NOT NULL,
	"ip" text NOT NULL,
	"headers" jsonb NOT NULL,
	"query_params" jsonb,
	"body" text,
	"status_code" integer DEFAULT 200 NOT NULL,
	"content_type" text,
	"content_length" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
