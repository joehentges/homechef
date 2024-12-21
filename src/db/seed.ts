import "dotenv/config"

import { database, pg } from "./index"
import { recipes, users } from "./schemas"
import { recipesSeed } from "./seed/recipes"
import { usersSeed } from "./seed/users"

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededRecipes = await database
    .insert(recipes)
    .values(recipesSeed as any)
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
