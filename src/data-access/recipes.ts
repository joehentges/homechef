import { eq, sql } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { RecipeDifficulty } from "@/types/Recipe"
import { database } from "@/db"
import { Recipe, recipes, recipeTags, tags } from "@/db/schemas"

export async function getRecipe(
  recipeId: PrimaryKey
): Promise<Recipe | undefined> {
  const recipe = await database.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  })

  return recipe
}

export async function getRandomRecipes(
  limit: number
): Promise<Recipe[] | undefined> {
  const recipesList = await database.query.recipes.findMany({
    limit,
    orderBy: sql`random()`,
  })

  return recipesList
}

export async function addRecipe(
  recipe: {
    userId?: PrimaryKey
    title: string
    description?: string | null
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    servings: string
    private?: boolean
    photo?: string | null
  },
  trx = database
) {
  const {
    userId,
    title,
    difficulty,
    prepTime,
    cookTime,
    description,
    servings,
    private: isPrivate,
    photo,
  } = recipe
  const [recipeData] = await trx
    .insert(recipes)
    .values({
      userId,
      title,
      description,
      prepTime,
      cookTime,
      difficulty,
      servings,
      private: isPrivate,
      photo,
    })
    .returning()

  return recipeData
}

export async function updateRecipe(
  recipeId: PrimaryKey,
  recipe: {
    title: string
    description?: string | null
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    servings: string
    private?: boolean
    photo?: string | null
  },
  trx = database
) {
  const {
    title,
    difficulty,
    prepTime,
    cookTime,
    description,
    servings,
    private: isPrivate,
    photo,
  } = recipe
  const [recipeData] = await trx
    .update(recipes)
    .set({
      title,
      description,
      prepTime,
      cookTime,
      difficulty,
      servings,
      private: isPrivate,
      photo,
    })
    .where(eq(recipes.id, recipeId))
    .returning()

  return recipeData
}

export async function deleteRecipe(recipeId: PrimaryKey) {
  await database.delete(recipes).where(eq(recipes.id, recipeId)).returning()
}
