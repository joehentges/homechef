"use server"

import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendForgotPasswordUseCase } from "@/use-cases/auth"

export const sendForgotPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: "send-forgot-password",
      limit: 3,
      window: 10000,
    })
    await sendForgotPasswordUseCase(input.email)
  })
