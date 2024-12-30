import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeDirection, recipeDirections } from "@/db/schemas"

export async function getRecipeDirection(
  recipeDirectionId: PrimaryKey
): Promise<RecipeDirection | undefined> {
  const recipeDirection = await database.query.recipeDirections.findFirst({
    where: eq(recipeDirections.id, recipeDirectionId),
  })

  return recipeDirection
}

export async function getRecipeDirectionsByRecipeId(
  recipeId: PrimaryKey
): Promise<RecipeDirection[] | undefined> {
  const recipeDirection = await database.query.recipeDirections.findMany({
    where: eq(recipeDirections.recipeId, recipeId),
  })

  return recipeDirection
}
