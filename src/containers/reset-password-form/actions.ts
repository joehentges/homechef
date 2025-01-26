"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { signInUrl } from "@/config"
import { rateLimitByIp } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { changePasswordUseCase } from "@/use-cases/auth"

export const resetPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      token: z.string().min(1),
      password: z.string().min(8),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: "reset-password",
      limit: 3,
      window: 10000,
    })
    await changePasswordUseCase(input.token, input.password)
    redirect(signInUrl)
  })
