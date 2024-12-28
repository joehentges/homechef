/* eslint-disable */
import "dotenv/config"

import { database, pg } from "./index"
import {
  recipeDirections,
  recipeImportDetails,
  recipeIngredients,
  recipePhotos,
  recipes,
  recipeTags,
  tags,
  users,
} from "./schemas"
import {
  recipeDirectionsSeed,
  recipeImportDetailsSeed,
  recipeIngredientsSeed,
  recipePhotosSeed,
  recipesSeed,
  recipeTagsSeed,
} from "./seed/recipes"
import { tagsSeed } from "./seed/tags"
import { usersSeed } from "./seed/users"

async function main() {
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededTags = await database
    .insert(tags)
    .values(tagsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipes = await database
    .insert(recipes)
    .values(recipesSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeImportDetails = await database
    .insert(recipeImportDetails)
    .values(recipeImportDetailsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeIngredients = await database
    .insert(recipeIngredients)
    .values(recipeIngredientsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipePhotos = await database
    .insert(recipePhotos)
    .values(recipePhotosSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeDirections = await database
    .insert(recipeDirections)
    .values(recipeDirectionsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeTags = await database
    .insert(recipeTags)
    .values(recipeTagsSeed as any)
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
