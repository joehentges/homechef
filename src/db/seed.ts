/* eslint-disable */
import "dotenv/config"

import { database, pg } from "./index"
import { tags, users } from "./schemas"
import { tagsSeed } from "./seed/tags"
import { usersSeed } from "./seed/users"

async function main() {
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  const seededTags = await database
    .insert(tags)
    .values(
      tagsSeed.map((tag) => ({
        name: tag,
      })) as any
    )
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
