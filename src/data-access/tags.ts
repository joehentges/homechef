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

export async function addTags(tagsList: string[]): Promise<Tag[]> {
  const tagsData = await database
    .insert(tags)
    .values(
      tagsList.map((tag) => ({
        name: tag,
      }))
    )
    .onConflictDoNothing()
    .returning()

  return tagsData
}
