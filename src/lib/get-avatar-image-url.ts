export function getAvatarImageUrl(displayName: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${displayName.toLowerCase().replace(" ", "")}`
}
