import { Recipe, RecipeImportDetails, User } from "@/db/schemas"

export type RecipeWithTags = Recipe & { tags: string[] }

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced" | null

export type IngredientOrDirection = {
  orderNumber: number
  description: string
}

export interface RecipeDetails {
  author?: User
  importedBy?: User
  importDetails?: RecipeImportDetails
  recipe: RecipeWithTags
  ingredients: IngredientOrDirection[]
  directions: IngredientOrDirection[]
}
