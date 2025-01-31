import { User } from "@/db/schemas"

export type UsersOrderBy = "alphabetically" | "importedcount" | "createdcount"

export type SearchUsersQuery = {
  search?: string
  orderBy?: UsersOrderBy
  limit?: number
  offset?: number
  userId?: User["id"] // to be excluded
}
