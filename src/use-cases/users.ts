import { SearchUsersQuery } from "@/types/SearchUsers"
import { UserDetails } from "@/types/UserDetails"
import { User } from "@/db/schemas"
import {
  getFeaturedUsers,
  getUser,
  searchUsers,
  updateUser,
} from "@/data-access/users"
import { redis } from "@/client/redis"

export async function getFeaturedUsersUseCase(limit: number = 10) {
  const cachedUsers = await redis.get("featured-users")
  if (cachedUsers) {
    const parsedUsers = JSON.parse(cachedUsers) as UserDetails[]
    if (parsedUsers.length > 0) {
      return parsedUsers
    }
  }

  const randomUsers = await getFeaturedUsers(limit)
  await redis.set(
    "featured-users",
    JSON.stringify(randomUsers),
    "EX",
    60 * 60 * 24
  ) // 24 hour cache

  return randomUsers
}

export async function searchUsersUseCase(query: SearchUsersQuery) {
  return searchUsers(query)
}

export async function getUserUseCase(userId: User["id"]) {
  return getUser(userId)
}

export async function updateProfileUseCase(
  userId: User["id"],
  updatedUser: {
    displayName: User["displayName"]
    image: User["image"]
    summary: User["summary"]
    featuredRecipeId: User["featuredRecipeId"]
  }
) {
  return updateUser(userId, updatedUser)
}
