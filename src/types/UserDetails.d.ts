import { User } from "@/db/schemas"

export type UserDetails = {
  id: User["id"]
  displayName: User["displayName"]
  image: User["image"]
  userRecipeCount: number
  userRecipeImportsCount: number
}
