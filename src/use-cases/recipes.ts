import { cache } from "react"

import { PrimaryKey } from "@/types"
import {
  IngredientOrDirection,
  RecipeDetails,
  RecipeWithTags,
} from "@/types/Recipe"
import { SearchRecipeParams, SearchRecipeQuery } from "@/types/SearchRecipes"
import { User } from "@/db/schemas"
import {
  addRecipeDirections,
  deleteRecipeDirectionsByRecipeId,
  getRecipeDirectionsByRecipeId,
} from "@/data-access/recipe-directions"
import {
  addRecipeIngredients,
  deleteRecipeIngredientsByRecipeId,
  getRecipeIngredientsByRecipeId,
} from "@/data-access/recipe-ingredients"
import {
  addRecipeTags,
  deleteRecipeTagsByRecipeId,
} from "@/data-access/recipe-tags"
import {
  addRecipe,
  deleteRecipe,
  getRandomRecipes,
  getRecipe,
  searchRecipes,
  updateRecipe,
} from "@/data-access/recipes"
import {
  getRecipeImportDetailsByRecipeId,
  getRecipeImportDetailsByUrl,
} from "@/data-access/recipes-import-details"
import { getAllTags, getTagsByName } from "@/data-access/tags"
import {
  getFirstUserImportedById,
  getUserRecipeImportsByIdAndUserId,
} from "@/data-access/user-recipe-imports"
import {
  addUserRecipe,
  deleteUserRecipeByRecipeIdAndUserId,
  getUserRecipeByRecipeIdAndUserId,
} from "@/data-access/user-recipes"
import { getUser } from "@/data-access/users"
import { createTransaction } from "@/data-access/utils"
import { redis } from "@/client/redis"

export async function getFeaturedRecipesUseCase(limit: number = 24) {
  const cachedRecipes = await redis.get("featured-recipes")
  if (cachedRecipes) {
    return JSON.parse(cachedRecipes) as RecipeWithTags[]
  }

  const randomRecipes = await getRandomRecipes(limit)
  await redis.set(
    "featured-recipes",
    JSON.stringify(randomRecipes),
    "EX",
    60 * 60 * 24
  ) // 24 hour cache

  return randomRecipes
}

export async function getRecipeByIdUseCase(
  recipeId: PrimaryKey
): Promise<RecipeDetails> {
  const recipe = await getRecipe(recipeId)

  if (!recipe) {
    throw new Error("Recipe not found")
  }

  let user
  if (recipe.userId) {
    user = await getUser(recipe.userId)
  }

  const recipeImportDetails = await getRecipeImportDetailsByRecipeId(recipeId)

  let importedBy: User | undefined
  if (recipeImportDetails) {
    importedBy = await getFirstUserImportedById(recipeImportDetails.id)
  }

  const recipeIngredients = await getRecipeIngredientsByRecipeId(recipeId)

  const recipeDirections = await getRecipeDirectionsByRecipeId(recipeId)

  return {
    author: user,
    importDetails: recipeImportDetails,
    importedBy,
    recipe,
    ingredients: recipeIngredients ?? [],
    directions: recipeDirections ?? [],
  }
}

export async function getRecipeImportDetailsByUrlUseCase(
  url: string,
  userId?: PrimaryKey
) {
  const recipeImportDetails = await getRecipeImportDetailsByUrl(url)
  let userRecipeImport
  if (recipeImportDetails && userId) {
    userRecipeImport = await getUserRecipeImportsByIdAndUserId(
      recipeImportDetails?.id,
      userId
    )
  }
  return {
    recipeImportDetails,
    userRecipeImport,
  }
}

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

export const getAvailableRecipeTagsUseCase = cache(async () => {
  return getAllTags()
})

export async function updateRecipeUseCase(
  recipe: Omit<RecipeWithTags, "dateCreated" | "dateUpdated" | "userId">,
  ingredients: IngredientOrDirection[],
  directions: IngredientOrDirection[],
  user: User
) {
  const updatedRecipeDetails = await createTransaction(async (trx) => {
    const updatedRecipe = await updateRecipe(
      recipe.id,
      {
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

    await deleteRecipeIngredientsByRecipeId(updatedRecipe.id, trx)

    let updatedRecipeIngredients
    if (ingredients.length > 0) {
      updatedRecipeIngredients = await addRecipeIngredients(
        updatedRecipe.id,
        ingredients,
        trx
      )
    }

    await deleteRecipeDirectionsByRecipeId(updatedRecipe.id, trx)

    let updatedRecipeDirections
    if (directions.length > 0) {
      updatedRecipeDirections = await addRecipeDirections(
        updatedRecipe.id,
        directions,
        trx
      )
    }

    await deleteRecipeTagsByRecipeId(updatedRecipe.id, trx)

    const updatedTagsList = await getTagsByName(recipe.tags)
    if (updatedTagsList.length > 1) {
      await addRecipeTags(updatedRecipe.id, updatedTagsList, trx)
    }

    return {
      author: user,
      recipe: updatedRecipe,
      ingredients: updatedRecipeIngredients ?? [],
      directions: updatedRecipeDirections ?? [],
      tags: updatedTagsList?.map((tag) => tag.name) ?? [],
    }
  })

  return updatedRecipeDetails as RecipeDetails
}

export async function deleteRecipeUseCase(recipeId: PrimaryKey) {
  await deleteRecipe(recipeId)
}

export async function isRecipeSavedUseCase(
  recipeId: PrimaryKey,
  userId: PrimaryKey
): Promise<boolean> {
  return !!(await getUserRecipeByRecipeIdAndUserId(recipeId, userId))
}

export async function saveRecipeUseCase(
  recipeId: PrimaryKey,
  userId: PrimaryKey
) {
  return addUserRecipe(recipeId, userId)
}

export async function unsaveRecipeUseCase(
  recipeId: PrimaryKey,
  userId: PrimaryKey
) {
  return deleteUserRecipeByRecipeIdAndUserId(recipeId, userId)
}

export async function getRandomRecipeUseCase(
  userId?: number
): Promise<RecipeWithTags | undefined> {
  const randomRecipesList = await getRandomRecipes(1, userId)
  return randomRecipesList[0]
}

export function searchRecipesUseCase(
  query: SearchRecipeQuery,
  params?: SearchRecipeParams
) {
  return searchRecipes(query, params)
}
