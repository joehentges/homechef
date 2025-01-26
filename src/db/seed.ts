/* eslint-disable */
import "dotenv/config"

import { sql } from "drizzle-orm"

import {
  IngredientOrDirection,
  RecipeDetails,
  RecipeWithTags,
} from "@/types/Recipe"
import { addRecipeDirections } from "@/data-access/recipe-directions"
import { addRecipeIngredients } from "@/data-access/recipe-ingredients"
import { addRecipeTags } from "@/data-access/recipe-tags"
import { addRecipe } from "@/data-access/recipes"
import { getTagsByName } from "@/data-access/tags"
import { addUserRecipe } from "@/data-access/user-recipes"
import { createTransaction } from "@/data-access/utils"

import { database, pg } from "./index"
import { tags, User, users } from "./schemas"
import { recipesSeed } from "./seed/recipes"
import { tagsSeed } from "./seed/tags"
import { usersSeed } from "./seed/users"

async function main() {
  console.log("seeding users...")
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  console.log("seeding tags...")
  const seededTags = await database
    .insert(tags)
    .values(
      tagsSeed.map((tag, index) => ({
        id: index,
        name: tag,
      })) as any
    )
    .onConflictDoNothing()
    .returning()

  console.log("seeding recipes...")
  let count = 0
  for (const recipe of recipesSeed) {
    if (count % 100 === 0) console.log(`On recipe ${count}`)
    await addRecipeUseCase(
      recipe.recipe,
      recipe.ingredients,
      recipe.directions,
      recipe.user
    )
    count += 1
  }

  await database.execute(
    sql`SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 0) + 1 FROM users));`
  )

  await database.execute(
    sql`SELECT setval(pg_get_serial_sequence('tags', 'id'), (SELECT COALESCE(MAX(id), 0) + 1 FROM tags));`
  )

  await database.execute(
    sql`SELECT setval(pg_get_serial_sequence('recipes', 'id'), (SELECT COALESCE(MAX(id), 0) + 1 FROM recipes));`
  )

  console.log("seeding complete")
  await pg.end()
}

main()

export async function addRecipeUseCase(
  recipe: Omit<RecipeWithTags, "id" | "dateCreated" | "dateUpdated" | "userId">,
  ingredients: IngredientOrDirection[],
  directions: IngredientOrDirection[],
  user: User
): Promise<RecipeDetails> {
  const recipeDetails = await createTransaction(async (trx) => {
    const newRecipe = await addRecipe(
      {
        userId: user.id,
        title: recipe.title,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        description: recipe.description,
        private: recipe.private,
        photo: recipe.photo,
      },
      trx
    )

    await addUserRecipe(newRecipe.id, user.id, trx)

    let recipeIngredients
    if (ingredients.length > 0) {
      recipeIngredients = await addRecipeIngredients(
        newRecipe.id,
        ingredients,
        trx
      )
    }

    let recipeDirections
    if (directions.length > 0) {
      recipeDirections = await addRecipeDirections(
        newRecipe.id,
        directions,
        trx
      )
    }

    const tagsList = await getTagsByName(recipe.tags)
    if (tagsList.length > 1) {
      await addRecipeTags(newRecipe.id, tagsList, trx)
    }

    return {
      author: user,
      recipe: newRecipe,
      ingredients: recipeIngredients ?? [],
      directions: recipeDirections ?? [],
      tags: tagsList?.map((tag) => tag.name) ?? [],
    }
  })

  return recipeDetails as RecipeDetails
}
