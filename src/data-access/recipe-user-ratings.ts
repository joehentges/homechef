import { avg, count, eq, SQL, sql } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeUserRating, recipeUserRatings } from "@/db/schemas"

export async function getRecipeUserRating(
  recipeUserRatingId: PrimaryKey
): Promise<RecipeUserRating | undefined> {
  const recipeUserRating = await database.query.recipeUserRatings.findFirst({
    where: eq(recipeUserRatings.id, recipeUserRatingId),
  })

  return recipeUserRating
}

export async function getRecipeUserRatingsData(
  recipeId: PrimaryKey
): Promise<{ average: number; count: number } | undefined> {
  const [recipeUserRatingsData] = await database
    .select({
      average: sql<number>`cast(avg(${recipeUserRatings.rating}) as int)`,
      count: sql<number>`cast(count(${recipeUserRatings.id}) as int)`,
    })
    .from(recipeUserRatings)
    .where(eq(recipeUserRatings.recipeId, recipeId))

  return recipeUserRatingsData
}
