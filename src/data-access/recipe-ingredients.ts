import { eq } from "drizzle-orm"

import { database } from "@/db"
import { Recipe, RecipeIngredient, recipeIngredients } from "@/db/schemas"

export async function getRecipeIngredientsByRecipeId(
  recipeId: Recipe["id"]
): Promise<RecipeIngredient[] | undefined> {
  const recipeIngredientsList = await database.query.recipeIngredients.findMany(
    {
      where: eq(recipeIngredients.recipeId, recipeId),
    }
  )

  return recipeIngredientsList
}

export async function addRecipeIngredients(
  recipeId: Recipe["id"],
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

export async function deleteRecipeIngredientsByRecipeId(
  recipeId: Recipe["id"],
  trx = database
) {
  await trx
    .delete(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, recipeId))
}
