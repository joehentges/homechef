import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { RecipeTag, recipeTags, Tag } from "@/db/schemas"

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
