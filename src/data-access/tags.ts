import { eq } from "drizzle-orm"

import { PrimaryKey } from "@/types"
import { database } from "@/db"
import { Tag, tags } from "@/db/schemas"

export async function getTag(tagId: PrimaryKey): Promise<Tag | undefined> {
  const tag = await database.query.tags.findFirst({
    where: eq(tags.id, tagId),
  })

  return tag
}
