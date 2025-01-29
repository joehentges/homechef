"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import {
  changePasswordUseCase,
  sendVerifyEmailUseCase,
  updateEmailUseCase,
} from "@/use-cases/auth"

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
    await updateEmailUseCase(user.id, input.email)
    revalidatePath("/settings")
  })

export const sendVerifyEmailAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByIp({
      key: "send-verify-email",
      limit: 3,
      window: 10000,
    })
    await sendVerifyEmailUseCase(user.id, input.email)
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
