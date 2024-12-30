import { PrimaryKey } from "@/types"
import { getRecipeDirectionsByRecipeId } from "@/data-access/recipe-directions"
import { getRecipeIngredientsByRecipeId } from "@/data-access/recipe-ingredients"
import { getRecipePhotosByRecipeId } from "@/data-access/recipe-photos"
import { getRecipeTagsByRecipeId } from "@/data-access/recipe-tags"
import { getRecipe } from "@/data-access/recipes"
import { getUser } from "@/data-access/users"

export async function getRecipeById(recipeId: PrimaryKey) {
  const recipe = await getRecipe(recipeId)

  if (!recipe) {
    throw new Error("Recipe not found")
  }

  const user = await getUser(recipe.userId)

  if (!user) {
    throw new Error("User not found")
  }

  const recipeIngredients = await getRecipeIngredientsByRecipeId(recipeId)

  const recipePhotos = await getRecipePhotosByRecipeId(recipeId)

  const recipeDirections = await getRecipeDirectionsByRecipeId(recipeId)

  const recipeTags = await getRecipeTagsByRecipeId(recipeId)

  return {
    ...recipe,
    user: {
      displayName: user.displayName,
      email: user.email,
      image: user.image,
    },
    ingredients: recipeIngredients,
    photos: recipePhotos,
    directions: recipeDirections,
    tags: recipeTags,
  }
}
