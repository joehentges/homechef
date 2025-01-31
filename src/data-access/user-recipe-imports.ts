import { and, asc, eq } from "drizzle-orm"

import { database } from "@/db"
import {
  RecipeImportDetails,
  User,
  UserRecipeImport,
  userRecipeImports,
  users,
} from "@/db/schemas"

export async function getUserRecipeImportsByIdAndUserId(
  recipeImportDetailsId: RecipeImportDetails["id"],
  userId: User["id"]
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
  recipeImportDetailsId: RecipeImportDetails["id"]
): Promise<User | undefined> {
  const [user] = await database
    .select({
      id: users.id,
      dateCreated: users.dateCreated,
      dateUpdated: users.dateUpdated,
      email: users.email,
      emailVerified: users.emailVerified,
      password: users.password,
      displayName: users.displayName,
      image: users.image,
      summary: users.summary,
      featuredRecipeId: users.featuredRecipeId,
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
    recipeImportDetailsId: RecipeImportDetails["id"]
    userId: User["id"]
  },
  trx = database
): Promise<UserRecipeImport | null> {
  const [recipeImportDetailsData] = await trx
    .insert(userRecipeImports)
    .values(userRecipeImport)
    .returning()

  return recipeImportDetailsData
}
