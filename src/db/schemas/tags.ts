import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull().unique(),
})

export type Tag = typeof tags.$inferSelect
