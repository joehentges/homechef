import { and, eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { Recipe, recipes, UserRecipe, userRecipes } from "@/db/schemas"

export async function getUserRecipeById(
  userRecipeId: PrimaryKey
): Promise<UserRecipe | undefined> {
  const userRecipe = await database.query.userRecipes.findFirst({
    where: eq(userRecipes.id, userRecipeId),
  })

  return userRecipe
}

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

export async function getUserRecipesByUserId(
  userId: PrimaryKey
): Promise<Recipe[] | undefined> {
  const userRecipesList = await database
    .select({
      id: recipes.id,
      dateCreated: recipes.dateCreated,
      dateUpdated: recipes.dateUpdated,
      userId: recipes.userId,
      title: recipes.title,
      description: recipes.description,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      difficulty: recipes.difficulty,
      servings: recipes.servings,
      private: recipes.private,
      photo: recipes.photo,
    })
    .from(userRecipes)
    .where(eq(userRecipes.userId, userId))
    .fullJoin(recipes, eq(userRecipes.recipeId, recipes.id))

  return userRecipesList as Recipe[]
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

export async function deleteUserRecipeByRecipeIdAndUserId(
  userId: PrimaryKey,
  recipeId: PrimaryKey,
  trx = database
) {
  await trx
    .delete(userRecipes)
    .where(
      and(eq(userRecipes.recipeId, recipeId), eq(userRecipes.userId, userId))
    )
    .returning()
}
