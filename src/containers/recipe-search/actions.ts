"use server"

import { z } from "zod"

import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { searchRecipesUseCase } from "@/use-cases/recipes"

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
    const recipeSearchResult = await searchRecipesUseCase(
      input.search,
      input.tags,
      input.sortBy,
      input.recipesPerPageLimit,
      limitLOffset
    )
    return {
      recipes: recipeSearchResult.recipes,
      count: recipeSearchResult.count,
      page: input.page,
    }
  })
