import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeTag, recipeTags, Tag, tags } from "@/db/schemas"

export async function getRecipeTagsByRecipeId(recipeId: PrimaryKey): Promise<
  | {
      id: number
      dateCreated: Date
      name: string
    }[]
  | undefined
> {
  const recipeIngredientsList = await database
    .select({
      id: recipeTags.id,
      dateCreated: recipeTags.dateCreated,
      name: tags.name,
    })
    .from(recipeTags)
    .where(eq(recipeTags.recipeId, recipeId))
    .innerJoin(tags, eq(recipeTags.tagId, tags.id))

  return recipeIngredientsList
}

export async function addRecipeTags(
  recipeId: PrimaryKey,
  tags: Tag[],
  trx = database
): Promise<RecipeTag[]> {
  const recipeTagsListData = await trx
    .insert(recipeTags)
    .values(tags.map((tag) => ({ recipeId, tagId: tag.id })))
    .returning()

  return recipeTagsListData
}

export async function deleteRecipeTagsByRecipeId(
  recipeId: PrimaryKey,
  trx = database
) {
  await trx.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId))
}
