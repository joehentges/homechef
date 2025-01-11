import {
  and,
  asc,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { RecipeDifficulty, RecipeWithTags } from "@/types/Recipe"
import { database } from "@/db"
import { Recipe, recipes, recipeTags, tags, userRecipes } from "@/db/schemas"

/*
// START - For testing only
function duplicateArray<T>(arr: T[], times: number): T[] {
  if (times <= 0) {
    return [] // Return empty array for non-positive times
  }

  const duplicatedArray: T[] = []
  for (let i = 0; i < times; i++) {
    duplicatedArray.push(...arr) // Use spread operator for efficient copying
  }
  return duplicatedArray
}
function randomizeRecipeDetails<T>(
  recipe: T & { title: string },
  index: number
): T {
  const start = new Date(2020, 0, 1) // January 1st of startYear
  const end = new Date(2024 + 1, 0, 1) // January 1st of (endYear + 1) to include the endYear

  // Get the time difference in milliseconds
  const startTime = start.getTime()
  const endTime = end.getTime()
  const diff = endTime - startTime

  // Generate a random number within the time difference
  const randomTime = Math.random() * diff

  return {
    ...recipe,
    dateUpdated: new Date(startTime + randomTime),
    title: `${recipe.title} - ${index}`,
    prepTime: Math.floor(Math.random() * (500 - 1)) + 1,
    cookTime: Math.floor(Math.random() * (500 - 1)) + 1,
  }
}
// END - For testing only
*/

export async function getRecipe(
  recipeId: PrimaryKey
): Promise<Recipe | undefined> {
  const recipe = await database.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  })

  return recipe
}

export async function getRandomRecipes(
  limit: number
): Promise<RecipeWithTags[] | undefined> {
  const recipesList = await database
    .select({
      id: recipes.id,
      dateCreated: recipes.dateCreated,
      dateUpdated: recipes.dateUpdated,
      userId: recipes.userId,
      title: recipes.title,
      description: recipes.description,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      difficulty: recipes.difficulty,
      servings: recipes.servings,
      private: recipes.private,
      photo: recipes.photo,
      tags: sql<string[]>`
      CASE
          WHEN EXISTS (
              SELECT 1
              FROM ${recipeTags}
              WHERE ${recipeTags.recipeId} = ${recipes.id}
          )
          THEN COALESCE(array_agg(${tags.name}), ARRAY[]::text[])
          ELSE ARRAY[]::text[]
      END`.as("tags"),
    })
    .from(recipes)
    .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
    .leftJoin(tags, eq(tags.id, recipeTags.tagId))
    .where(eq(recipes.private, false))
    .groupBy(recipes.id)
    .limit(limit)
    .orderBy(sql`random()`)

  return recipesList
}

export async function getRandomRecipe(): Promise<Recipe | undefined> {
  const recipe = await database.query.recipes.findFirst({
    where: eq(recipes.private, false),
    orderBy: sql`random()`,
  })

  return recipe
}

export async function searchRecipesByTitleDescriptionTagsAndSortBy(
  search: string,
  searchTags: string[],
  sortBy: "newest" | "fastest" | "easiest",
  limit: number,
  offset?: number
): Promise<{ recipes: RecipeWithTags[]; count: number }> {
  const searchByClause = or(
    ilike(recipes.title, `%${search}%`),
    ilike(recipes.description, `%${search}%`)
  )

  const recipesList = await database
    .select({
      id: recipes.id,
      dateCreated: recipes.dateCreated,
      dateUpdated: recipes.dateUpdated,
      userId: recipes.userId,
      title: recipes.title,
      description: recipes.description,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      difficulty: recipes.difficulty,
      servings: recipes.servings,
      private: recipes.private,
      photo: recipes.photo,
      tags: sql<string[]>`
      CASE
          WHEN EXISTS (
              SELECT 1
              FROM ${recipeTags}
              WHERE ${recipeTags.recipeId} = ${recipes.id}
          )
          THEN COALESCE(array_agg(${tags.name}), ARRAY[]::text[])
          ELSE ARRAY[]::text[]
      END`.as("tags"),
    })
    .from(recipes)
    .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
    .leftJoin(tags, eq(tags.id, recipeTags.tagId))
    .where(
      and(
        eq(recipes.private, false),
        or(
          searchTags.length > 0
            ? and(
                searchByClause,
                exists(
                  database
                    .select()
                    .from(recipeTags)
                    .innerJoin(tags, eq(tags.id, recipeTags.tagId))
                    .where(
                      and(
                        eq(recipeTags.recipeId, recipes.id),
                        inArray(tags.name, searchTags)
                      )
                    )
                )
              )
            : searchByClause
        )
      )
    )
    .groupBy(recipes.id)
    .limit(limit)
    .offset(offset ?? 0)
    .orderBy(
      sortBy === "fastest"
        ? asc(sql`${recipes.prepTime} + ${recipes.cookTime}`)
        : sortBy === "easiest"
          ? sql`
        CASE ${recipes.difficulty}
          WHEN 'beginner' THEN 1
          WHEN 'intermediate' THEN 2
          WHEN 'advanced' THEN 3
          ELSE 4
        END
      `
          : desc(recipes.dateUpdated)
    )

  const [recipeCount] = await database // Destructure directly
    .select({
      count: sql<number>`count(DISTINCT ${recipes.id})`, // Count distinct recipe IDs
    })
    .from(recipes)
    .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
    .leftJoin(tags, eq(tags.id, recipeTags.tagId))
    .where(
      and(
        eq(recipes.private, false),
        or(
          searchTags.length > 0
            ? and(
                searchByClause,
                exists(
                  database
                    .select()
                    .from(recipeTags)
                    .innerJoin(tags, eq(tags.id, recipeTags.tagId))
                    .where(
                      and(
                        eq(recipeTags.recipeId, recipes.id),
                        inArray(tags.name, searchTags)
                      )
                    )
                )
              )
            : searchByClause
        )
      )
    )

  return {
    recipes: recipesList,
    count: recipeCount?.count ?? 0,
  }
}

export async function getUserRecipes(
  userId: PrimaryKey
): Promise<RecipeWithTags[]> {
  const recipesList = await database
    .select({
      id: recipes.id,
      dateCreated: recipes.dateCreated,
      dateUpdated: recipes.dateUpdated,
      userId: recipes.userId,
      title: recipes.title,
      description: recipes.description,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      difficulty: recipes.difficulty,
      servings: recipes.servings,
      private: recipes.private,
      photo: recipes.photo,
      tags: sql<string[]>`
      CASE
          WHEN EXISTS (
              SELECT 1
              FROM ${recipeTags}
              WHERE ${recipeTags.recipeId} = ${recipes.id}
          )
          THEN COALESCE(array_agg(${tags.name}), ARRAY[]::text[])
          ELSE ARRAY[]::text[]
      END`.as("tags"),
    })
    .from(recipes)
    .leftJoin(userRecipes, eq(userRecipes.recipeId, recipes.id))
    .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
    .leftJoin(tags, eq(tags.id, recipeTags.tagId))
    .where(eq(userRecipes.userId, userId))
    .groupBy(recipes.id)

  return recipesList
}

export async function addRecipe(
  recipe: {
    userId?: PrimaryKey
    title: string
    description?: string | null
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    servings: string
    private?: boolean
    photo?: string | null
  },
  trx = database
) {
  const {
    userId,
    title,
    difficulty,
    prepTime,
    cookTime,
    description,
    servings,
    private: isPrivate,
    photo,
  } = recipe
  const [recipeData] = await trx
    .insert(recipes)
    .values({
      userId,
      title,
      description,
      prepTime,
      cookTime,
      difficulty,
      servings,
      private: isPrivate,
      photo,
    })
    .returning()

  return recipeData
}

export async function updateRecipe(
  recipeId: PrimaryKey,
  recipe: {
    title: string
    description?: string | null
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    servings: string
    private?: boolean
    photo?: string | null
  },
  trx = database
) {
  const {
    title,
    difficulty,
    prepTime,
    cookTime,
    description,
    servings,
    private: isPrivate,
    photo,
  } = recipe
  const [recipeData] = await trx
    .update(recipes)
    .set({
      dateUpdated: new Date(),
      title,
      description,
      prepTime,
      cookTime,
      difficulty,
      servings,
      private: isPrivate,
      photo,
    })
    .where(eq(recipes.id, recipeId))
    .returning()

  return recipeData
}

export async function deleteRecipe(recipeId: PrimaryKey) {
  await database.delete(recipes).where(eq(recipes.id, recipeId)).returning()
}

export async function searchRecipes(
  search: string,
  limit: number,
  offset?: number
): Promise<Recipe[]> {
  const recipesList = await database.query.recipes.findMany({
    where: and(
      eq(recipes.private, false),
      or(
        ilike(recipes.title, `%${search}%`),
        ilike(recipes.description, `%${search}%`)
      )
    ),
    limit,
    offset,
  })

  return recipesList
}
