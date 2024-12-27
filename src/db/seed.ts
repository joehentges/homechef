import "dotenv/config"

import { database, pg } from "./index"
import {
  ingredients,
  recipeIngredients,
  recipePhotos,
  recipes,
  recipeSteps,
  recipeTags,
  recipeUserRatings,
  tags,
  users,
} from "./schemas"
import { ingredientsSeed } from "./seed/ingredients"
import {
  recipeIngredientsSeed,
  recipePhotosSeed,
  recipesSeed,
  recipeStepsSeed,
  recipeTagsSeed,
  recipeUserRatingsSeed,
} from "./seed/recipes"
import { tagsSeed } from "./seed/tags"
import { usersSeed } from "./seed/users"

console.log(
  recipeIngredientsSeed,
  recipePhotosSeed,
  recipesSeed,
  recipeStepsSeed,
  recipeTagsSeed,
  recipeUserRatingsSeed
)

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededIngredients = await database
    .insert(ingredients)
    .values(ingredientsSeed as any)
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

  const seededRecipeSteps = await database
    .insert(recipeSteps)
    .values(recipeStepsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeTags = await database
    .insert(recipeTags)
    .values(recipeTagsSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipeUserRatings = await database
    .insert(recipeUserRatings)
    .values(recipeUserRatingsSeed as any)
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
