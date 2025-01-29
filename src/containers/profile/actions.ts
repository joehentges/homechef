"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import { searchRecipesUseCase } from "@/use-cases/recipes"
import { updateProfileUseCase } from "@/use-cases/users"

const updateProfileActionSchema = z.object({
  displayName: z.string().min(3).max(25),
  image: z.string().url().nullable(),
  summary: z.string().min(3).max(300).nullable(),
  featuredRecipeId: z.number().nullable(),
})

export const updateProfileAction = authenticatedAction
  .createServerAction()
  .input(updateProfileActionSchema)
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      limit: 3,
      window: 10000,
    })
    await updateProfileUseCase(user.id, input)
    revalidatePath(`/chefs/${user.id}`)
    revalidatePath("/profile")
  })

export const featuredRecipeSearchAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      limit: 1000,
      window: 10000,
    })
    const recipeSearchResult = await searchRecipesUseCase(
      {
        search: input.search,
        limit: 5,
      },
      {
        userId: user.id,
        includeUserRecipes: true,
        userRecipesOnly: true,
      }
    )
    return {
      recipes: recipeSearchResult.recipes,
      count: recipeSearchResult.count,
    }
  })
