type RecipeSeed = {
  id: number
  userId: number
  title: string
  description: string | null
  prepTime: number | null
  cookTime: number
  difficulty: "easy" | "medium" | "hard" | null
  servings: number
  servingsUnit: string | null
}

type RecipeIngredientsSeed = {
  id: number
  recipeId: number
  ingredientId: number
  description: string | null
  quantity: number
  unit: string | null
}

type RecipeStepsSeed = {
  id: number
  recipeId: number
  stepNumber: number
  description: string
}

type RecipeTagsSeed = {
  id: number
  recipeId: number
  tagId: number
}

type RecipePhotosSeed = {
  id: number
  recipeId: number
  photoUrl: string
  defaultPhoto: boolean
}

type RecipeUserRatingSeed = {
  id: number
  userId: number
  recipeId: number
  rating: number
  review: string | null
}

export interface CompleteRecipeSeed {
  recipe: RecipeSeed
  recipeIngredients: RecipeIngredientsSeed[]
  recipeSteps: RecipeStepsSeed[]
  recipeTags: RecipeTagsSeed[]
  recipePhotos: RecipePhotosSeed[]
  recipeUserRatings: RecipeUserRatingSeed[]
}
