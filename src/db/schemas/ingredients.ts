import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  name: text("name").notNull().unique(),
})

export type Ingredient = typeof ingredients.$inferSelect
