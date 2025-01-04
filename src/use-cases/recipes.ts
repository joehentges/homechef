import { PrimaryKey } from "@/types"
import {
  FormattedRecipeDetails,
  RecipeDetails,
  UserDetails,
} from "@/types/Recipe"
import {
  addRecipeDirections,
  getRecipeDirectionsByRecipeId,
} from "@/data-access/recipe-directions"
import {
  addRecipeIngredients,
  getRecipeIngredientsByRecipeId,
} from "@/data-access/recipe-ingredients"
import {
  addRecipeTags,
  getRecipeTagsByRecipeId,
} from "@/data-access/recipe-tags"
import { addRecipe, getRecipe } from "@/data-access/recipes"
import {
  getRecipeImportDetailsByRecipeId,
  getRecipeImportDetailsByUrl,
} from "@/data-access/recipes-import-details"
import { getAllTags, getTagsByName } from "@/data-access/tags"
import {
  getFirstUserImportedById,
  getUserRecipeImportsByIdAndUserId,
} from "@/data-access/user-recipe-imports"
import { getUserRecipeById } from "@/data-access/user-recipes"
import { getUser } from "@/data-access/users"
import { createTransaction } from "@/data-access/utils"

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
  formattedRecipeDetails: FormattedRecipeDetails
): Promise<RecipeDetails> {
  const { author, recipe, ingredients, directions, tags } =
    formattedRecipeDetails

  const recipeDetails = await createTransaction(async (trx) => {
    let user
    if (author) {
      user = await getUser(author.id)
    }

    const newRecipe = await addRecipe(
      {
        userId: author?.id,
        title: recipe.title,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        description: recipe.description,
      },
      trx
    )

    const recipeIngredients = await addRecipeIngredients(
      newRecipe.id,
      ingredients,
      trx
    )

    const recipeDirections = await addRecipeDirections(
      newRecipe.id,
      directions,
      trx
    )

    let tagsList
    if (tags) {
      tagsList = await getTagsByName(tags)
      if (tagsList.length > 1) {
        await addRecipeTags(newRecipe.id, tagsList, trx)
      }
    }

    return {
      author: user,
      recipe,
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
