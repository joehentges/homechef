import {
  Recipe,
  RecipeDirection,
  RecipeImportDetails,
  RecipeIngredient,
  RecipeTag,
  User,
  UserRecipeImport,
} from "@/db/schemas"

import { PrimaryKey } from "."

export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced" | null

export type UserDetails = {
  id: PrimaryKey
  displayName: string
}

export interface RecipeDetails {
  recipe: Recipe
  author?: User
  importDetails?: RecipeDetailsImmportDetails | null
  firstToImportRecipe?: UserDetails | null
  ingredients: RecipeIngredient[]
  directions: RecipeDirection[]
  tags: string[]
}

export interface FormattedRecipeDetails {
  author?: UserDetails
  importDetails?: {
    importedBy?: UserDetails | null
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
