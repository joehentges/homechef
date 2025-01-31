import { eq } from "drizzle-orm"

import { database } from "@/db"
import { Recipe, RecipeDirection, recipeDirections } from "@/db/schemas"

export async function getRecipeDirectionsByRecipeId(
  recipeId: Recipe["id"]
): Promise<RecipeDirection[] | undefined> {
  const recipeDirection = await database.query.recipeDirections.findMany({
    where: eq(recipeDirections.recipeId, recipeId),
  })

  return recipeDirection
}

export async function addRecipeDirections(
  recipeId: Recipe["id"],
  directions: { orderNumber: number; description: string }[],
  trx = database
): Promise<RecipeDirection[]> {
  const recipeDirectionsListData = await trx
    .insert(recipeDirections)
    .values(
      directions.map((direction) => ({
        recipeId,
        orderNumber: direction.orderNumber,
        description: direction.description,
      }))
    )
    .returning()

  return recipeDirectionsListData
}

export async function deleteRecipeDirectionsByRecipeId(
  recipeId: Recipe["id"],
  trx = database
) {
  await trx
    .delete(recipeDirections)
    .where(eq(recipeDirections.recipeId, recipeId))
}
