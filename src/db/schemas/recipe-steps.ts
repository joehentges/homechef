import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"

export const recipeSteps = pgTable("recipe_steps", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  recipeId: serial("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" })
    .unique(),
  stepNumber: integer("step_number").notNull(),
  description: text("description"),
})

export type RecipeStep = typeof recipeSteps.$inferSelect
