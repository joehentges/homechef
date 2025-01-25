"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import { updateUserUseCase } from "@/use-cases/users"

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
    await updateUserUseCase(user.id, input)
    revalidatePath(`/chefs/${user.id}`)
    revalidatePath("/profile")
  })
