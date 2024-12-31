export type RecipeDetailsPhoto = {
  defaultPhoto: boolean
  photoUrl: string
}

export interface RecipeDetails {
  author: {
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
