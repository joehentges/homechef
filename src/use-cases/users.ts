import { FeaturedUser } from "@/types/FeaturedUser"
import { getFeaturedUsers, searchUsers } from "@/data-access/users"
import { redis } from "@/client/redis"

export async function getFeaturedUsersUseCase(limit: number) {
  const cachedUsers = await redis.get("featured-users")
  if (cachedUsers) {
    return JSON.parse(cachedUsers) as FeaturedUser[]
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

export async function searchUsersUseCase(search: string, limit: number) {
  return searchUsers(search, limit)
}
