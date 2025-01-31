import { eq, inArray } from "drizzle-orm"

import { database } from "@/db"
import { Tag, tags } from "@/db/schemas"

export async function getTag(tagId: Tag["id"]): Promise<Tag | undefined> {
  const tag = await database.query.tags.findFirst({
    where: eq(tags.id, tagId),
  })

  return tag
}

export async function getTagsByName(tagNames: string[]): Promise<Tag[]> {
  const tagsList = await database.query.tags.findMany({
    where: inArray(tags.name, tagNames),
  })

  return tagsList
}

export async function getAllTags(): Promise<Tag[]> {
  const tagsList = await database.select().from(tags).orderBy(tags.name)

  return tagsList
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
