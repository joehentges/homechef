"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { signInUrl } from "@/config"
import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action"
import { clearSession } from "@/lib/session"
import { searchRecipesUseCase } from "@/use-cases/recipes"
import { searchUsersUseCase } from "@/use-cases/users"

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async () => {
    await rateLimitByIp({ limit: 3, window: 10000 })
    await clearSession()
    redirect(signInUrl)
  })

export const searchRecipesAndUsersAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      search: z.string(),
      limit: z.number().default(5),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ limit: 1000, window: 10000 })
    const recipes = await searchRecipesUseCase({
      search: input.search,
      limit: input.limit,
    })
    const users = await searchUsersUseCase(input.search, input.limit)
    return {
      recipes: recipes.recipes,
      users,
    }
  })
