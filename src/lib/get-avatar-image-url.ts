import { User } from "@/db/schemas"

export function getAvatarImageUrl(displayName: User["displayName"]) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${displayName.toLowerCase().replace(" ", "")}`
}
