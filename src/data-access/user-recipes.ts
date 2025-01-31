import { and, eq } from "drizzle-orm"

import { database } from "@/db"
import { Recipe, User, UserRecipe, userRecipes } from "@/db/schemas"

export async function getUserRecipeByRecipeIdAndUserId(
  recipeId: Recipe["id"],
  userId: User["id"]
) {
  const userRecipe = await database.query.userRecipes.findFirst({
    where: and(
      eq(userRecipes.recipeId, recipeId),
      eq(userRecipes.userId, userId)
    ),
  })

  return userRecipe
}

export async function addUserRecipe(
  recipeId: Recipe["id"],
  userId: User["id"],
  trx = database
): Promise<UserRecipe> {
  const [userRecipe] = await trx
    .insert(userRecipes)
    .values({
      userId,
      recipeId,
    })
    .returning()

  return userRecipe
}

export async function deleteUserRecipeByRecipeIdAndUserId(
  recipeId: Recipe["id"],
  userId: User["id"],
  trx = database
) {
  await trx
    .delete(userRecipes)
    .where(
      and(eq(userRecipes.recipeId, recipeId), eq(userRecipes.userId, userId))
    )
    .returning()
}
