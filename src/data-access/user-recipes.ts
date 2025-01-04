import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { UserRecipe, userRecipes } from "@/db/schemas"

export async function getUserRecipeById(
  userRecipeId: PrimaryKey
): Promise<UserRecipe | undefined> {
  const userRecipe = await database.query.userRecipes.findFirst({
    where: eq(userRecipes.id, userRecipeId),
  })

  return userRecipe
}

export async function getUserRecipesByUserId(
  userId: PrimaryKey
): Promise<UserRecipe[] | undefined> {
  const userRecipesList = await database.query.userRecipes.findMany({
    where: eq(userRecipes.userId, userId),
  })

  return userRecipesList
}

export async function addUserRecipe(
  userId: PrimaryKey,
  recipeId: PrimaryKey,
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
