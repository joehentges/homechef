import { FormattedRecipeDetails, RecipeDetails } from "@/types/Recipe"

export function formatRecipe(
  recipeDetails: RecipeDetails
): FormattedRecipeDetails {
  const {
    author,
    importDetails,
    firstToImportRecipe,
    recipe,
    ingredients,
    directions,
    tags,
  } = recipeDetails

  return {
    author: author
      ? {
          id: author.id,
          displayName: author.displayName,
        }
      : undefined,
    importDetails: importDetails
      ? {
          importedBy: firstToImportRecipe,
          url: importDetails.url,
        }
      : undefined,
    recipe: {
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      difficulty: recipe.difficulty,
      private: recipe.private,
      photo: recipe.photo,
    },
    ingredients: ingredients.map((ingredient) => ({
      orderNumber: ingredient.orderNumber,
      description: ingredient.description,
    })),
    directions: directions.map((direction) => ({
      orderNumber: direction.orderNumber,
      description: direction.description,
    })),
    tags,
  }
}
