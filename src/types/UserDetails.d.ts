import { User } from "@/db/schemas"

export type UserDetails = {
  id: User["id"]
  displayName: string
  image: string | null
  userRecipeCount: number
  userRecipeImportsCount: number
}
