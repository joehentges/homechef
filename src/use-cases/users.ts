import { PrimaryKey } from "@/types"
import { SearchUsersQuery } from "@/types/SearchUsers"
import { UserDetails } from "@/types/UserDetails"
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
    return JSON.parse(cachedUsers) as UserDetails[]
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

export async function getUserUseCase(userId: PrimaryKey) {
  return getUser(userId)
}

export async function updateUserUseCase(
  userId: PrimaryKey,
  updatedUser: {
    displayName: string
    image: string | null
    summary: string | null
    featuredRecipeId: PrimaryKey | null
  }
) {
  return updateUser(userId, updatedUser)
}
