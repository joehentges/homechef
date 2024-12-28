import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  title: text("title").notNull(),
  description: text("description"),
  prepTime: integer("prep_time").default(0),
  cookTime: integer("cook_time").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }),
  servings: text("servings").notNull(),
})

export type Recipe = typeof recipes.$inferSelect
