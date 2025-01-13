import { and, eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { UserRecipe, userRecipes } from "@/db/schemas"

export async function getUserRecipeByRecipeIdAndUserId(
  recipeId: PrimaryKey,
  userId: PrimaryKey
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
  recipeId: PrimaryKey,
  userId: PrimaryKey,
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
  recipeId: PrimaryKey,
  userId: PrimaryKey,
  trx = database
) {
  await trx
    .delete(userRecipes)
    .where(
      and(eq(userRecipes.recipeId, recipeId), eq(userRecipes.userId, userId))
    )
    .returning()
}
