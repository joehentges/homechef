import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { ingredients } from "./ingredients"
import { recipes } from "./recipes"

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  recipeId: serial("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" })
    .unique(),
  ingredientId: serial("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" })
    .unique(),
  description: text("description"),
  quantity: integer("quantity").notNull(),
  unit: text("unit"),
})

export type RecipeIngredient = typeof recipeIngredients.$inferSelect
