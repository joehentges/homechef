import { User } from "@/db/schemas"
import { getRandomUsers, searchUsers } from "@/data-access/users"
import { redis } from "@/client/redis"

export async function geFeaturedUsersUseCase(limit: number) {
  const cachedUsers = await redis.get("featured-users")
  if (cachedUsers) {
    return JSON.parse(cachedUsers) as Omit<User, "password">[]
  }

  const randomUsers = await getRandomUsers(limit)
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
