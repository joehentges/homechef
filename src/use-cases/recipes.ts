import { PrimaryKey } from "@/types"
import {
  FormattedRecipeDetails,
  RecipeDetails,
  RecipeWithTags,
  UserDetails,
} from "@/types/Recipe"
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
  getRecipeTagsByRecipeId,
} from "@/data-access/recipe-tags"
import {
  addRecipe,
  deleteRecipe,
  getRandomRecipe,
  getRandomRecipes,
  getRecipe,
  getUserRecipes,
  searchRecipes,
  searchRecipesByTitleDescriptionTagsAndSortBy,
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

export async function geFeaturedRecipesUseCase(limit: number) {
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

  let firstToImportRecipe: UserDetails | undefined
  if (recipeImportDetails) {
    firstToImportRecipe = await getFirstUserImportedById(recipeImportDetails.id)
  }

  const recipeIngredients = await getRecipeIngredientsByRecipeId(recipeId)

  const recipeDirections = await getRecipeDirectionsByRecipeId(recipeId)

  const recipeTags = await getRecipeTagsByRecipeId(recipeId)

  return {
    author: user,
    importDetails: recipeImportDetails,
    firstToImportRecipe,
    recipe,
    ingredients: recipeIngredients ?? [],
    directions: recipeDirections ?? [],
    tags: recipeTags?.map((tag) => tag.name) ?? [],
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
  formattedRecipeDetails: FormattedRecipeDetails,
  user: User
): Promise<RecipeDetails> {
  const { recipe, ingredients, directions, tags } = formattedRecipeDetails

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

    let tagsList
    if (tags) {
      tagsList = await getTagsByName(tags)
      if (tagsList.length > 1) {
        await addRecipeTags(newRecipe.id, tagsList, trx)
      }
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

export async function getAvailableRecipeTagsUseCase() {
  return getAllTags()
}

export async function updateRecipeUseCase(
  formattedRecipeDetails: FormattedRecipeDetails,
  user: User
) {
  const { recipe, ingredients, directions, tags } = formattedRecipeDetails

  const updatedRecipeDetails = await createTransaction(async (trx) => {
    if (!recipe.id) {
      throw new Error()
    }
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

    let updatedTagsList
    if (tags) {
      updatedTagsList = await getTagsByName(tags)
      if (updatedTagsList.length > 1) {
        await addRecipeTags(updatedRecipe.id, updatedTagsList, trx)
      }
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

export async function searchRecipesByTitleDescriptionTagsAndSortByUseCase(
  search: string,
  searchTags: string[],
  sortBy: "newest" | "fastest" | "easiest",
  limit: number,
  offset: number
) {
  return searchRecipesByTitleDescriptionTagsAndSortBy(
    search,
    searchTags,
    sortBy,
    limit,
    offset
  )
}

export async function getUserRecipesUseCase(userId: PrimaryKey) {
  return getUserRecipes(userId)
}

export async function getRandomRecipeUseCase() {
  return getRandomRecipe()
}

export async function searchRecipesUseCase(search: string, limit: number) {
  return searchRecipes(search, limit)
}
