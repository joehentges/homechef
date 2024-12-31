import { PrimaryKey } from "."

export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

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
  description?: string
  servings: string
  prepTime: number | null
  cookTime: number
  ingredients: string[]
  directions: string[]
  photos?: RecipeDetailsPhoto[]
  datePublished: Date
  dateModified: Date
  tags?: string[]
}
