import {
  Recipe,
  RecipeDirection,
  RecipeImportDetails,
  RecipeIngredient,
  RecipeTag,
  User,
} from "@/db/schemas"

import { PrimaryKey } from "."

export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced" | null

export type RecipeDetailsImmportDetails = {
  importedBy?: {
    id: number
    displayName: string
  } | null
  url: recipeImportDetails.url
}

export interface RecipeDetails {
  recipe: Recipe
  author?: User
  importDetails?: RecipeDetailsImmportDetails | null
  ingredients: RecipeIngredient[]
  directions: RecipeDirection[]
  tags: string[]
}

export interface FormattedRecipeDetails {
  author?: {
    id: PrimaryKey
    displayName: string
  }
  importDetails?: {
    importedBy?: {
      id: number
      displayName: string
    } | null
    url: string
  }
  recipe: {
    title: string
    description?: string | null
    servings: string
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    private: boolean
    photo?: string | null
  }
  ingredients: { orderNumber: number; description: string }[]
  directions: { orderNumber: number; description: string }[]
  tags?: string[]
}
