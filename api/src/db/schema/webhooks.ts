import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const webhooks = pgTable("webhooks", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  method: text().notNull(),
  pathName: text().notNull(),
  ip: text().notNull(),
  headers: jsonb().$type<Record<string, string[]>>().notNull(),
  queryParams: jsonb().$type<Record<string, string[]>>(),
  body: text(),
  statusCode: integer().notNull().default(200),
  contentType: text(),
  contentLength: integer(),
  createdAt: timestamp().notNull().defaultNow(),
});
