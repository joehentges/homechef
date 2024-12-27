import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeStep, recipeSteps } from "@/db/schemas"

export async function getRecipeStep(
  recipeStepId: PrimaryKey
): Promise<RecipeStep | undefined> {
  const recipeStep = await database.query.recipeSteps.findFirst({
    where: eq(recipeSteps.id, recipeStepId),
  })

  return recipeStep
}

export async function getRecipeStepsByRecipeId(
  recipeId: PrimaryKey
): Promise<RecipeStep[] | undefined> {
  const recipeStep = await database.query.recipeSteps.findMany({
    where: eq(recipeSteps.recipeId, recipeId),
  })

  return recipeStep
}
