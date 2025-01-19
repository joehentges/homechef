import { PrimaryKey } from "./index"

export type UserDetails = {
  id: PrimaryKey
  displayName: string
  image: string | null
  userRecipeCount: number
  userRecipeImportsCount: number
}
