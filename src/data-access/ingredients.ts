import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { Ingredient, ingredients } from "@/db/schemas"

export async function getIngredient(
  ingredientId: PrimaryKey
): Promise<Ingredient | undefined> {
  const ingredient = await database.query.ingredients.findFirst({
    where: eq(ingredients.id, ingredientId),
  })

  return ingredient
}
