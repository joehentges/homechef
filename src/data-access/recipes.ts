import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { RecipeDifficulty } from "@/types/Recipe"
import { database } from "@/db"
import { Recipe, recipes } from "@/db/schemas"

export async function getRecipe(
  recipeId: PrimaryKey
): Promise<Recipe | undefined> {
  const recipe = await database.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  })

  return recipe
}

export async function addRecipe(recipe: {
  userId?: PrimaryKey
  title: string
  description?: string | null
  prepTime?: number | null
  cookTime: number
  difficulty?: RecipeDifficulty
  servings: string
}) {
  const {
    userId,
    title,
    difficulty,
    prepTime,
    cookTime,
    description,
    servings,
  } = recipe
  const [recipeData] = await database
    .insert(recipes)
    .values({
      userId,
      title,
      description,
      prepTime,
      cookTime,
      difficulty,
      servings,
    })
    .returning()

  return recipeData
}
