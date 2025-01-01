import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeImportDetails, recipeImportDetails } from "@/db/schemas"

export async function getRecipeImportDetails(
  recipeImportDetailsId: PrimaryKey
): Promise<RecipeImportDetails | undefined> {
  const recipeImportDetailsData =
    await database.query.recipeImportDetails.findFirst({
      where: eq(recipeImportDetails.id, recipeImportDetailsId),
    })

  return recipeImportDetailsData
}

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
  recipeId: PrimaryKey
): Promise<RecipeImportDetails | undefined> {
  const recipeImportDetailsData =
    await database.query.recipeImportDetails.findFirst({
      where: eq(recipeImportDetails.recipeId, recipeId),
    })

  return recipeImportDetailsData
}

export async function addRecipeImportDetails(
  recipeId: PrimaryKey,
  url: string,
  trx = database
): Promise<RecipeImportDetails | null> {
  const [recipeImportDetailsData] = await trx
    .insert(recipeImportDetails)
    .values({
      recipeId,
      url,
    })
    .returning()

  return recipeImportDetailsData
}
