import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { ingredients, RecipeIngredient, recipeIngredients } from "@/db/schemas"

export async function getRecipeIngredient(
  recipeIngredientId: PrimaryKey
): Promise<RecipeIngredient | undefined> {
  const recipeIngredient = await database.query.recipeIngredients.findFirst({
    where: eq(recipeIngredients.id, recipeIngredientId),
  })

  return recipeIngredient
}

export async function getRecipeIngredientsByRecipeId(
  recipeId: PrimaryKey
): Promise<
  | {
      id: number
      dateCreated: Date
      dateUpdated: Date
      description: string | null
      name: string
      quantity: string
      unit: string | null
    }[]
  | undefined
> {
  const recipeIngredientsList = await database
    .select({
      id: recipeIngredients.id,
      dateCreated: recipeIngredients.dateCreated,
      dateUpdated: recipeIngredients.dateUpdated,
      description: recipeIngredients.description,
      name: ingredients.name,
      quantity: recipeIngredients.quantity,
      unit: recipeIngredients.unit,
    })
    .from(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, recipeId))
    .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))

  return recipeIngredientsList
}
