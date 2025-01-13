import { and, asc, eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { UserDetails } from "@/types/Recipe"
import { database } from "@/db"
import { UserRecipeImport, userRecipeImports, users } from "@/db/schemas"

export async function getUserRecipeImportsByIdAndUserId(
  recipeImportDetailsId: PrimaryKey,
  userId: PrimaryKey
): Promise<UserRecipeImport | undefined> {
  const userRecipeImportsList =
    await database.query.userRecipeImports.findFirst({
      where: and(
        eq(userRecipeImports.recipeImportDetailsId, recipeImportDetailsId),
        eq(userRecipeImports.userId, userId)
      ),
    })

  return userRecipeImportsList
}

// get the user who first imported the recipe
export async function getFirstUserImportedById(
  recipeImportDetailsId: PrimaryKey
): Promise<UserDetails | undefined> {
  const [user] = await database
    .select({
      id: users.id,
      displayName: users.displayName,
    })
    .from(userRecipeImports)
    .where(eq(userRecipeImports.recipeImportDetailsId, recipeImportDetailsId))
    .orderBy(asc(userRecipeImports.dateCreated))
    .limit(1)
    .innerJoin(users, eq(userRecipeImports.userId, users.id))

  return user
}

export async function addUserRecipeImport(
  userRecipeImport: {
    recipeImportDetailsId: PrimaryKey
    userId: PrimaryKey
  },
  trx = database
): Promise<UserRecipeImport | null> {
  const [recipeImportDetailsData] = await trx
    .insert(userRecipeImports)
    .values(userRecipeImport)
    .returning()

  return recipeImportDetailsData
}
