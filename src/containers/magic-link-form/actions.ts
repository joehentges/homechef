"use server"

import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendMagicLinkUseCase } from "@/use-cases/auth"

export const sendMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      from: z.string().min(1).optional(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: "send-magic-link",
      limit: 3,
      window: 10000,
    })
    await sendMagicLinkUseCase(input.email, input.from)
  })
