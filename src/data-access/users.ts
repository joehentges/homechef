import argon2 from "argon2"
import { and, asc, desc, eq, ilike, ne, or, sql } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { SearchUsersQuery } from "@/types/SearchUsers"
import { UserDetails } from "@/types/UserDetails"
import { database } from "@/db"
import { User, userRecipeImports, userRecipes, users } from "@/db/schemas"

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password)
}

export async function getUser(userId: PrimaryKey): Promise<User | undefined> {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return user
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  })

  return user
}

export async function verifyPassword(
  userId: PrimaryKey,
  plainTextPassword: string
): Promise<boolean> {
  const user = await getUser(userId)

  if (!user) {
    return false
  }

  const hashedPassword = user.password

  if (!hashedPassword) {
    return false
  }

  return verifyPasswordHash(hashedPassword, plainTextPassword)
}

export async function updateUser(
  userId: PrimaryKey,
  updatedUser: Partial<User>
): Promise<void> {
  await database.update(users).set(updatedUser).where(eq(users.id, userId))
}

export async function updatePassword(
  userId: PrimaryKey,
  password: string,
  trx = database
): Promise<void> {
  const hash = await hashPassword(password)
  await trx
    .update(users)
    .set({
      password: hash,
    })
    .where(eq(users.id, userId))
}

export async function setEmailVerified(userId: PrimaryKey): Promise<void> {
  await database
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId))
}

export async function createUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const hash = await hashPassword(password)
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: undefined,
      password: hash,
      displayName,
    })
    .returning()
  return user
}

export async function createMagicUser(
  email: string,
  displayName: string
): Promise<User> {
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
      password: undefined,
      displayName,
    })
    .returning()

  return user
}

export async function searchUsers(query: SearchUsersQuery): Promise<{
  users: UserDetails[]
  count: number
}> {
  const userRecipeCount = sql<number>`count(DISTINCT ${userRecipes.id})`.as(
    "userRecipeCount"
  )
  const userRecipeImportsCount =
    sql<number>`count(DISTINCT ${userRecipeImports.id})`.as(
      "userRecipeImportsCount"
    )

  const searchUsersDbQuery = database
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
      userRecipeCount,
      userRecipeImportsCount,
    })
    .from(users)
    .leftJoin(userRecipes, eq(userRecipes.userId, users.id))
    .leftJoin(userRecipeImports, eq(userRecipeImports.userId, users.id))
    .groupBy(users.id)
    .orderBy(
      query.orderBy === "createdcount"
        ? desc(userRecipeCount)
        : query.orderBy === "importedcount"
          ? desc(userRecipeImportsCount)
          : asc(users.displayName)
    )

  const usersCountDbQuery = database
    .select({
      count: sql<number>`count(DISTINCT ${users.id})`,
    })
    .from(users)

  if (query.userId) {
    if (query.search) {
      searchUsersDbQuery.where(
        and(
          ne(users.id, query.userId),
          or(
            ilike(users.email, `%${query.search ?? ""}%`),
            ilike(users.displayName, `%${query.search ?? ""}%`)
          )
        )
      )
      usersCountDbQuery.where(
        and(
          ne(users.id, query.userId),
          or(
            ilike(users.email, `%${query.search ?? ""}%`),
            ilike(users.displayName, `%${query.search ?? ""}%`)
          )
        )
      )
    } else {
      searchUsersDbQuery.where(ne(users.id, query.userId))
      usersCountDbQuery.where(ne(users.id, query.userId))
    }
  } else if (query.search) {
    searchUsersDbQuery.where(
      or(
        ilike(users.email, `%${query.search ?? ""}%`),
        ilike(users.displayName, `%${query.search ?? ""}%`)
      )
    )
    usersCountDbQuery.where(
      or(
        ilike(users.email, `%${query.search ?? ""}%`),
        ilike(users.displayName, `%${query.search ?? ""}%`)
      )
    )
  }

  if (query.limit) {
    searchUsersDbQuery.limit(query.limit)
  }

  if (query.offset) {
    searchUsersDbQuery.offset(query.offset)
  }

  const usersList = await searchUsersDbQuery.execute()
  const [usersCount] = await usersCountDbQuery.execute()

  return {
    users: usersList,
    count: usersCount?.count ?? 0,
  }
}

export async function getFeaturedUsers(limit: number): Promise<UserDetails[]> {
  const usersList = await database
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
      userRecipeCount: sql<number>`count(DISTINCT ${userRecipes.id})`,
      userRecipeImportsCount: sql<number>`count(DISTINCT ${userRecipeImports.id})`,
    })
    .from(users)
    .leftJoin(userRecipes, eq(userRecipes.userId, users.id))
    .leftJoin(userRecipeImports, eq(userRecipeImports.userId, users.id))
    .groupBy(users.id)
    .limit(limit)
    .orderBy(sql`random()`)

  return usersList
}
