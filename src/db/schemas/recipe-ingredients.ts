import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  orderNumber: integer("order_number").notNull(),
  description: text("description").notNull(),
})

export type RecipeIngredient = typeof recipeIngredients.$inferSelect
