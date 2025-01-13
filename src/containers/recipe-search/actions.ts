"use server"

import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { searchRecipesUseCase } from "@/use-cases/recipes"

export const searchRecipesAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
      tags: z.array(z.string()),
      orderBy: z.enum(["newest", "easiest", "fastest"]),
      recipesPerPageLimit: z.number(),
      page: z.number().default(1),
      userId: z.number().optional(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({
      limit: 1000,
      window: 10000,
    })
    const limitLOffset = (input.page - 1) * input.recipesPerPageLimit
    const recipeSearchResult = await searchRecipesUseCase(
      {
        search: input.search,
        tags: input.tags,
        orderBy: input.orderBy,
        limit: input.recipesPerPageLimit,
        offset: limitLOffset,
      },
      {
        userId: input.userId,
        includeUserRecipes: !!input.userId,
      }
    )
    return {
      recipes: recipeSearchResult.recipes,
      count: recipeSearchResult.count,
      page: input.page,
    }
  })
