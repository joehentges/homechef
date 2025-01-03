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
  id: number
  dateCreated: Date
  dateUpdated: Date
  recipeId: number
  importedBy: {
    id: number
    displayName: string
  }
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

interface FormattedRecipeDetails {
  author?: {
    id: PrimaryKey
    displayName: string
  }
  importDetails?: {
    importedBy?: {
      id: number
      displayName: string
    }
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
  }
  ingredients: { orderNumber: number; description: string }[]
  directions: { orderNumber: number; description: string }[]
  tags?: string[]
}

interface FormattedImportRecipeDetails {
  importDetails: {
    importedBy?: PrimaryKey
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
  }
  ingredients: { orderNumber: number; description: string }[]
  directions: { orderNumber: number; description: string }[]
  tags?: string[]
}
