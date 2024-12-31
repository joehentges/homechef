import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
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

export async function addRecipe() {}
//
