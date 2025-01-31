import { eq } from "drizzle-orm"

import { database } from "@/db"
import {
  Recipe,
  RecipeImportDetails,
  recipeImportDetails,
  User,
} from "@/db/schemas"

export async function getRecipeImportDetailsByUrl(
  url: string
): Promise<RecipeImportDetails | undefined> {
  const recipeImportDetailsData =
    await database.query.recipeImportDetails.findFirst({
      where: eq(recipeImportDetails.url, url),
    })

  return recipeImportDetailsData
}

export async function getRecipeImportDetailsByRecipeId(
  recipeId: Recipe["id"]
): Promise<RecipeImportDetails | undefined> {
  const recipeImportDetailsData =
    await database.query.recipeImportDetails.findFirst({
      where: eq(recipeImportDetails.recipeId, recipeId),
    })

  return recipeImportDetailsData
}

export async function addRecipeImportDetails(
  importDetails: {
    importedBy?: User["id"]
    recipeId: Recipe["id"]
    url: string
  },
  trx = database
): Promise<RecipeImportDetails | null> {
  const [recipeImportDetailsData] = await trx
    .insert(recipeImportDetails)
    .values(importDetails)
    .returning()

  return recipeImportDetailsData
}
