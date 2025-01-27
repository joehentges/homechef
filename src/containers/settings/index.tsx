"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { User } from "@/db/schemas"
import { useToast } from "@/hooks/use-toast"

import { changeEmailAction, changePasswordAction } from "./actions"

interface SettingsProps {
  user: User
}

const changeEmailFormSchema = z.object({
  email: z.string().email(),
})

const changePasswordFormSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function Settings(props: SettingsProps) {
  const { user } = props
  const { toast } = useToast()

  const changeEmailForm = useForm<z.infer<typeof changeEmailFormSchema>>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      email: user.email,
    },
  })

  const changePasswordForm = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { execute: executeChangeEmail, isPending: changeEmailIsPending } =
    useServerAction(changeEmailAction, {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        })
      },
      onSuccess() {
        toast({
          title: "Successfully changed your email",
          description: "Check for a confirmation email your change.",
        })
      },
    })

  const { execute: executeChangePassword, isPending: changePasswordIsPending } =
    useServerAction(changePasswordAction, {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        })
      },
      onSuccess() {
        toast({
          title: "Successfully changed your password",
          description: "You have successfully changed your password.",
        })
      },
    })

  function onChangePasswordSubmit(
    values: z.infer<typeof changePasswordFormSchema>
  ) {
    executeChangePassword(values)
  }

  function onChangeEmailSubmit(values: z.infer<typeof changeEmailFormSchema>) {
    executeChangeEmail(values)
  }

  return (
    <div className="bg-primary/20 relative container max-w-[1000px] space-y-6 rounded-3xl py-8">
      <p className="text-2xl">Settings</p>
    </div>
  )
}
