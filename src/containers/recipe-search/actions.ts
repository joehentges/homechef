"use server"

import { z } from "zod"

import { rateLimitByKey } from "@/lib/limiter"
import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action"
import {
  searchRecipesUseCase,
  searchUserRecipesUseCase,
} from "@/use-cases/recipes"

export const searchRecipesAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
      tags: z.array(z.string()),
      sortBy: z.enum(["newest", "easiest", "fastest"]),
      recipesPerPageLimit: z.number(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByKey({
      key: `search-recipes-${input.search}`,
      limit: 100,
      window: 10000,
    })
    const limitLOffset = (input.page - 1) * input.recipesPerPageLimit
    return await searchRecipesUseCase(
      input.search,
      input.tags,
      input.sortBy,
      input.recipesPerPageLimit,
      limitLOffset
    )
  })

export const searchUserRecipesAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
      tags: z.array(z.string()),
      sortBy: z.enum(["newest", "easiest", "fastest"]),
      recipesPerPageLimit: z.number(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `search-user-recipes-${user.id}`,
      limit: 100,
      window: 10000,
    })
    const limitLOffset = (input.page - 1) * input.recipesPerPageLimit
    return await searchUserRecipesUseCase(
      user.id,
      input.search,
      input.tags,
      input.sortBy,
      input.recipesPerPageLimit,
      limitLOffset
    )
  })
