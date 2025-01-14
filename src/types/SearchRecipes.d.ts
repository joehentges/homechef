export type OrderBy = "newest" | "easiest" | "fastest"

export type SearchRecipeQuery = {
  search?: string
  tags?: string[]
  orderBy?: OrderBy
  limit?: number
  offset?: number
}

export type SearchRecipeParams = {
  includeUserRecipes?: boolean
  userRecipesOnly?: boolean
  userId?: PrimaryKey
}
