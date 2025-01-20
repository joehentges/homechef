export type RecipesOrderBy = "newest" | "easiest" | "fastest"

export type SearchRecipeQuery = {
  search?: string
  tags?: string[]
  orderBy?: RecipesOrderBy
  limit?: number
  offset?: number
}

export type SearchRecipeParams = {
  includePrivateRecipes?: boolean
  includeUserRecipes?: boolean
  userRecipesOnly?: boolean
  userId?: PrimaryKey
}
