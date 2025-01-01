import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { recipes } from "./recipes"

export const userRecipes = pgTable("user_recipes", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
})

export type UserRecipe = typeof userRecipes.$inferSelect
