import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  name: text("name").notNull(),
})

export type Tag = typeof tags.$inferSelect
