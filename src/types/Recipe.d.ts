import {
  Recipe,
  RecipeDirection,
  RecipeImportDetails,
  RecipeIngredient,
  RecipePhoto,
  RecipeTag,
  User,
} from "@/db/schemas"

import { PrimaryKey } from "."

export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced" | null

export interface RecipeDetails {
  recipe: Recipe
  author?: User
  importDetails?: RecipeImportDetails | null
  ingredients: RecipeIngredient[]
  directions: RecipeDirection[]
  photos: RecipePhoto[]
  tags: string[]
}

interface FormattedRecipeDetails {
  author?: {
    id: PrimaryKey
    displayName: string
  }
  importDetails?: {
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
  photos?: RecipeDetailsPhoto[]
  tags?: string[]
}
