import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { RecipeDetailsImmportDetails } from "@/types/Recipe"
import { database } from "@/db"
import { RecipeImportDetails, recipeImportDetails, users } from "@/db/schemas"

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
): Promise<RecipeDetailsImmportDetails | undefined> {
  const [recipeImportDetailsData] = await database
    .select({
      id: recipeImportDetails.id,
      dateCreated: recipeImportDetails.dateCreated,
      dateUpdated: recipeImportDetails.dateUpdated,
      recipeId: recipeImportDetails.recipeId,
      importedBy: {
        id: users.id,
        displayName: users.displayName,
      },
      url: recipeImportDetails.url,
    })
    .from(recipeImportDetails)
    .where(eq(recipeImportDetails.recipeId, recipeId))
    .innerJoin(users, eq(recipeImportDetails.importedBy, users.id))

  return recipeImportDetailsData
}

export async function addRecipeImportDetails(
  importDetails: {
    importedBy?: PrimaryKey
    recipeId: PrimaryKey
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
