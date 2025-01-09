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

export async function searchRecipes(
  search: string,
  searchTags: string[],
  sortBy: "newest" | "fastest" | "easiest",
  limit: number,
  offset: number
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
    .groupBy(recipes.id) // Crucial for grouping
    .limit(limit)
    .offset(offset)
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

  const [recipeCount] = await database
    .select({ count: sql<number>`count(*)` })
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
