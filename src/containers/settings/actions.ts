"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import { changePasswordUseCase } from "@/use-cases/auth"

export const changeEmailAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      key: "change-email",
      limit: 3,
      window: 10000,
    })
    revalidatePath("/settings")
  })

export const changePasswordAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      password: z.string().min(8),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      key: "change-password",
      limit: 3,
      window: 10000,
    })
    await changePasswordUseCase(user.id, input.password)
    revalidatePath("/settings")
  })
