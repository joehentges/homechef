import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipePhoto, recipePhotos } from "@/db/schemas"

export async function getRecipePhoto(
  recipePhotoId: PrimaryKey
): Promise<RecipePhoto | undefined> {
  const recipePhoto = await database.query.recipePhotos.findFirst({
    where: eq(recipePhotos.id, recipePhotoId),
  })

  return recipePhoto
}

export async function getRecipePhotosByRecipeId(
  recipeId: PrimaryKey
): Promise<RecipePhoto[] | undefined> {
  const recipePhotosList = await database.query.recipePhotos.findMany({
    where: eq(recipePhotos.recipeId, recipeId),
  })

  return recipePhotosList
}
