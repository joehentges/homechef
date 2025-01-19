"use server"

import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { searchUsersUseCase } from "@/use-cases/users"

export const searchChefsAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
      orderBy: z.enum(["alphabetically", "importedcount", "createdcount"]),
      chefsPerPageLimit: z.number(),
      page: z.number().default(1),
      userId: z.number().optional(),
    })
  )
  .handler(async ({ input }) => {
    console.log("hitting action")
    await rateLimitByIp({
      limit: 1000,
      window: 10000,
    })
    const limitLOffset = (input.page - 1) * input.chefsPerPageLimit
    const usersSearchResult = await searchUsersUseCase({
      search: input.search,
      orderBy: input.orderBy,
      limit: input.chefsPerPageLimit,
      offset: limitLOffset,
      userId: input.userId,
    })
    console.log(usersSearchResult)
    return {
      users: usersSearchResult.users,
      count: usersSearchResult.count,
      page: input.page,
    }
  })
