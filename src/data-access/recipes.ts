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
import { SearchRecipeParams, SearchRecipeQuery } from "@/types/SearchRecipes"
import { database } from "@/db"
import { recipes, recipeTags, tags, userRecipes, users } from "@/db/schemas"

function defaultRecipeQuery() {
  return database
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
    .leftJoin(users, eq(users.id, recipes.userId))
    .groupBy(recipes.id)
}

export async function getRecipe(
  recipeId: PrimaryKey
): Promise<RecipeWithTags | undefined> {
  const [recipe] = await defaultRecipeQuery()
    .where(eq(recipes.id, recipeId))
    .limit(1)

  return recipe
}

export async function getRandomRecipes(
  limit: number,
  userId?: PrimaryKey
): Promise<RecipeWithTags[]> {
  const recipesListDbQuery = defaultRecipeQuery()

  if (userId) {
    recipesListDbQuery.where(
      or(eq(userRecipes.userId, userId), eq(recipes.private, false))
    )
  } else {
    recipesListDbQuery.where(eq(recipes.private, false))
  }

  recipesListDbQuery.limit(limit).orderBy(sql`random()`)

  const recipesList = await recipesListDbQuery.execute()

  return recipesList
}

export async function searchRecipes(
  query: SearchRecipeQuery,
  params?: SearchRecipeParams
) {
  const searchByClause = or(
    ilike(recipes.title, `%${query.search ?? ""}%`),
    ilike(recipes.description, `%${query.search ?? ""}%`)
  )

  let searchByTagsClause
  if (query.tags && query.tags.length > 0) {
    searchByTagsClause = exists(
      database
        .select()
        .from(recipeTags)
        .innerJoin(tags, eq(tags.id, recipeTags.tagId))
        .where(
          and(
            eq(recipeTags.recipeId, recipes.id),
            inArray(tags.name, query.tags)
          )
        )
    )
  }

  const recipesListDbQuery = defaultRecipeQuery()
  const recipesCountDbQuery = database
    .select({
      count: sql<number>`count(DISTINCT ${recipes.id})`,
    })
    .from(recipes)
    .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
    .leftJoin(tags, eq(tags.id, recipeTags.tagId))

  let whereQuery = and(
    eq(recipes.private, false),
    or(
      searchByTagsClause
        ? and(searchByClause, searchByTagsClause)
        : searchByClause
    )
  )
  if (params?.includeUserRecipes && params.userId) {
    recipesListDbQuery.leftJoin(
      userRecipes,
      eq(userRecipes.recipeId, recipes.id)
    )
    recipesCountDbQuery.leftJoin(
      userRecipes,
      eq(userRecipes.recipeId, recipes.id)
    )

    whereQuery = and(
      or(
        eq(userRecipes.userId, params.userId),
        params.includePrivateRecipes
          ? or(eq(recipes.private, true), eq(recipes.private, false))
          : eq(recipes.private, false)
      ),
      or(
        searchByTagsClause
          ? and(searchByClause, searchByTagsClause)
          : searchByClause
      )
    )
    if (params.userRecipesOnly) {
      whereQuery = and(
        params.includePrivateRecipes
          ? or(eq(recipes.private, true), eq(recipes.private, false))
          : eq(recipes.private, false),
        eq(userRecipes.userId, params.userId),
        or(
          searchByTagsClause
            ? and(searchByClause, searchByTagsClause)
            : searchByClause
        )
      )
    }
  }
  recipesListDbQuery.where(whereQuery)
  recipesCountDbQuery.where(whereQuery)

  if (query.limit) {
    recipesListDbQuery.limit(query.limit)
  }

  if (query.offset) {
    recipesListDbQuery.offset(query.offset)
  }

  if (query.orderBy === "fastest") {
    recipesListDbQuery.orderBy(
      asc(sql`${recipes.prepTime} + ${recipes.cookTime}`)
    )
  } else if (query.orderBy === "easiest") {
    recipesListDbQuery.orderBy(sql`
      CASE ${recipes.difficulty}
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
        ELSE 4
      END
    `)
  } else {
    recipesListDbQuery.orderBy(desc(recipes.dateUpdated))
  }

  const recipesList = await recipesListDbQuery.execute()
  const [recipeCount] = await recipesCountDbQuery.execute()

  return {
    recipes: recipesList,
    count: recipeCount?.count ?? 0,
  }
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
