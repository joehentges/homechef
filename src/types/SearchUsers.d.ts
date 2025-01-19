import { PrimaryKey } from "./index"

export type UsersOrderBy = "alphabetically" | "importedcount" | "createdcount"

export type SearchUsersQuery = {
  search?: string
  orderBy?: UsersOrderBy
  limit?: number
  offset?: number
  userId?: PrimaryKey // to be excluded
}
