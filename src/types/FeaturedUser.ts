import { PrimaryKey } from "./index"

export type FeaturedUser = {
  id: PrimaryKey
  displayName: string
  image: string | null
  userRecipeCount: number
  userRecipeImportsCount: number
}
