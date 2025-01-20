"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"

const updateProfileActionSchema = z.object({
  displayName: z.string().min(3),
})

export const updateProfileAction = authenticatedAction
  .createServerAction()
  .input(updateProfileActionSchema)
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      limit: 3,
      window: 10000,
    })

    revalidatePath(`/profile/${user.id}`)
  })
