export type RecipesOrderBy = "newest" | "easiest" | "fastest"

export type SearchRecipeQuery = {
  search?: string
  tags?: string[]
  orderBy?: RecipesOrderBy
  limit?: number
  offset?: number
}

export type SearchRecipeParams = {
  includeUserRecipes?: boolean
  userRecipesOnly?: boolean
  userId?: PrimaryKey
}
