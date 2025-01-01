import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeIngredient, recipeIngredients } from "@/db/schemas"

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
): Promise<RecipeIngredient[] | undefined> {
  const recipeIngredientsList = await database.query.recipeIngredients.findMany(
    {
      where: eq(recipeIngredients.recipeId, recipeId),
    }
  )

  return recipeIngredientsList
}

export async function addRecipeIngredients(
  recipeId: PrimaryKey,
  ingredientsList: { description: string; orderNumber: number }[],
  trx = database
): Promise<RecipeIngredient[]> {
  const recipeIngredientsListData = await trx
    .insert(recipeIngredients)
    .values(
      ingredientsList.map((ingredient) => ({
        recipeId,
        description: ingredient.description,
        orderNumber: ingredient.orderNumber,
      }))
    )
    .returning()

  return recipeIngredientsListData
}
