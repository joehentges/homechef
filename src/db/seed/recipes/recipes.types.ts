type RecipeSeed = {
  id: number
  userId: number
  title: string
  description: string | null
  prepTime: number | null
  cookTime: number
  difficulty: "easy" | "medium" | "hard" | null
  servings: string
}

type RecipeIngredientsSeed = {
  id: number
  recipeId: number
  description: string
}

type RecipeDirectionsSeed = {
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

type RecipeImportDetails = {
  id: number
  name: string
  recipeId: number
  url: string
}

export interface CompleteRecipeSeed {
  recipe: RecipeSeed
  recipeImportDetails: RecipeImportDetails | null
  recipeIngredients: RecipeIngredientsSeed[]
  recipeDirections: RecipeDirectionsSeed[]
  recipeTags: RecipeTagsSeed[]
  recipePhotos: RecipePhotosSeed[]
}
