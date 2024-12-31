import { PrimaryKey } from "."

export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced" | null

export interface RecipeDetails {
  author?: {
    userId: PrimaryKey
    displayName: string
  }
  importDetails?: {
    name: string
    url: string
  }
  title: string
  description?: string | null
  servings: string
  prepTime: number | null
  cookTime: number
  difficulty?: RecipeDifficulty
  private: boolean
  ingredients: string[]
  directions: { stepNumber: number; description: string }[]
  photos?: RecipeDetailsPhoto[]
  tags?: string[]
}
