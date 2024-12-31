import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"

export const recipeImportDetails = pgTable("recipe_import_details", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  url: text("url").notNull(),
})

export type RecipeImportDetails = typeof recipeImportDetails.$inferSelect
