import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeDirection, recipeDirections } from "@/db/schemas"

export async function getRecipeDirectionsByRecipeId(
  recipeId: PrimaryKey
): Promise<RecipeDirection[] | undefined> {
  const recipeDirection = await database.query.recipeDirections.findMany({
    where: eq(recipeDirections.recipeId, recipeId),
  })

  return recipeDirection
}

export async function addRecipeDirections(
  recipeId: PrimaryKey,
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
  recipeId: PrimaryKey,
  trx = database
) {
  await trx
    .delete(recipeDirections)
    .where(eq(recipeDirections.recipeId, recipeId))
}
