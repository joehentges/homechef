/* eslint-disable */
import "dotenv/config"

import { database, pg } from "./index"
import { users } from "./schemas"
import { usersSeed } from "./seed/users"

async function main() {
  const seededUsers = await database
    .insert(users)
    .values(usersSeed as any)
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
