import argon2 from "argon2"
import { eq, ilike, or, sql } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { User, users } from "@/db/schemas"

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

export async function searchUsers(
  search: string,
  limit: number,
  offset?: number
): Promise<User[]> {
  const usersList = database
    .select()
    .from(users)
    .where(
      or(
        ilike(users.email, `%${search}%`),
        ilike(users.displayName, `%${search}%`)
      )
    )
    .limit(limit)
    .offset(offset ?? 0)

  return usersList
}

export async function getRandomUsers(limit: number): Promise<User[]> {
  const recipesList = await database
    .select()
    .from(users)
    .limit(limit)
    .orderBy(sql`random()`)

  return recipesList
}
