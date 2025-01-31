import { eq } from "drizzle-orm"

import { database } from "@/db"
import { Recipe, RecipeTag, recipeTags, Tag } from "@/db/schemas"

export async function addRecipeTags(
  recipeId: Recipe["id"],
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
  recipeId: Recipe["id"],
  trx = database
) {
  await trx.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId))
}
