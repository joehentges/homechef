import { PrimaryKey } from "@/types"
import { RecipeDetails } from "@/types/Recipe"
import {
  addRecipeDirections,
  getRecipeDirectionsByRecipeId,
} from "@/data-access/recipe-directions"
import {
  addRecipeIngredients,
  getRecipeIngredientsByRecipeId,
} from "@/data-access/recipe-ingredients"
import {
  addRecipePhotos,
  getRecipePhotosByRecipeId,
} from "@/data-access/recipe-photos"
import {
  addRecipeTags,
  getRecipeTagsByRecipeId,
} from "@/data-access/recipe-tags"
import { addRecipe, getRecipe } from "@/data-access/recipes"
import {
  addRecipeImportDetails,
  getRecipeImportDetailsByRecipeId,
  getRecipeImportDetailsByUrl,
} from "@/data-access/recipes-import-details"
import { getAllTags, getTagsByName } from "@/data-access/tags"
import { getUser } from "@/data-access/users"
import { createTransaction } from "@/data-access/utils"
import { getDomain } from "@/lib/get-domain"

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

  const recipeIngredients = await getRecipeIngredientsByRecipeId(recipeId)

  const recipePhotos = await getRecipePhotosByRecipeId(recipeId)

  const recipeDirections = await getRecipeDirectionsByRecipeId(recipeId)

  const recipeTags = await getRecipeTagsByRecipeId(recipeId)

  return {
    author: user
      ? {
          userId: user.id,
          displayName: user.displayName,
        }
      : undefined,
    importDetails: recipeImportDetails
      ? {
          name: getDomain(recipeImportDetails.url),
          url: recipeImportDetails.url,
        }
      : undefined,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    difficulty: recipe.difficulty,
    private: recipe.private,
    ingredients: recipeIngredients ?? [],
    photos: recipePhotos,
    directions:
      recipeDirections?.map((direction) => ({
        stepNumber: direction.stepNumber,
        description: direction.description,
      })) ?? [],
    tags: recipeTags?.map((tag) => tag.name),
  }
}

export async function getRecipeImportDetailsByUrlUseCase(url: string) {
  return getRecipeImportDetailsByUrl(url)
}

export async function addRecipeUseCase(
  recipeDetails: RecipeDetails
): Promise<RecipeDetails> {
  const {
    author,
    importDetails,
    title,
    description,
    prepTime,
    cookTime,
    difficulty,
    servings,
    ingredients,
    directions,
    photos,
    tags,
  } = recipeDetails

  const recipeDetailsFormatted = await createTransaction(async (trx) => {
    let user
    if (author) {
      user = await getUser(author.userId)
    }

    const recipe = await addRecipe(
      {
        userId: author?.userId,
        title,
        prepTime,
        cookTime,
        difficulty,
        servings,
        description,
      },
      trx
    )

    let recipeImportDetails
    if (importDetails) {
      recipeImportDetails = await addRecipeImportDetails(
        recipe.id,
        importDetails?.url,
        trx
      )
    }

    const recipeIngredients = await addRecipeIngredients(
      recipe.id,
      ingredients,
      trx
    )

    const recipeDirections = await addRecipeDirections(
      recipe.id,
      directions,
      trx
    )

    let recipePhotos
    if (photos) {
      recipePhotos = await addRecipePhotos(recipe.id, photos, trx)
    }

    let tagsList
    if (tags) {
      tagsList = await getTagsByName(tags)
      if (tagsList.length > 1) {
        await addRecipeTags(recipe.id, tagsList, trx)
      }
    }

    return {
      author: user
        ? {
            userId: user.id,
            displayName: user.displayName,
          }
        : undefined,
      importDetails: recipeImportDetails
        ? {
            name: getDomain(recipeImportDetails.url),
            url: recipeImportDetails.url,
          }
        : undefined,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      difficulty: recipe.difficulty,
      private: recipe.private,
      ingredients: recipeIngredients ?? [],
      photos: recipePhotos,
      directions:
        recipeDirections?.map((direction) => ({
          stepNumber: direction.stepNumber,
          description: direction.description,
        })) ?? [],
      tags: tagsList?.map((tag) => tag.name),
    }
  })

  return recipeDetailsFormatted as RecipeDetails
}

export async function getAvailableRecipeTagsUseCase() {
  return getAllTags()
}
