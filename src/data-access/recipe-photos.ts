import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { RecipeDetailsPhoto } from "@/types/Recipe"
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

export async function addRecipePhotos(
  recipeId: PrimaryKey,
  photosList: RecipeDetailsPhoto[]
): Promise<RecipePhoto[]> {
  const recipePhotosListData = await database
    .insert(recipePhotos)
    .values(
      photosList.map((photo) => ({
        recipeId,
        defaultPhoto: photo.defaultPhoto,
        photoUrl: photo.photoUrl,
      }))
    )
    .returning()

  return recipePhotosListData
}
