"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Tooltip } from "@radix-ui/react-tooltip"
import { CheckIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { User } from "@/db/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { changeEmailAction, sendVerifyEmailAction } from "./actions"

interface ChangeEmailProps {
  currentEmail: User["email"]
  emailVerified: User["emailVerified"]
}

const changeEmailFormSchema = z.object({
  email: z.string().email(),
})

export function ChangeEmail(props: ChangeEmailProps) {
  const { currentEmail, emailVerified } = props
  const { toast } = useToast()

  const form = useForm<z.infer<typeof changeEmailFormSchema>>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      email: currentEmail,
    },
  })

  const { execute, isPending } = useServerAction(changeEmailAction, {
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

  const {
    execute: executeSendVerifyEmail,
    isPending: sendVerifyemailIsPending,
  } = useServerAction(sendVerifyEmailAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Successfully sent your verification email",
        description: "Check your email to verify.",
      })
    },
  })

  function onSubmit(values: z.infer<typeof changeEmailFormSchema>) {
    execute(values)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-2">
        <p className="text-lg">Email Address</p>
        {emailVerified ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-primary">
                <CheckIcon className="h-5 w-5 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>You have verified your email</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-primary">
                <XIcon className="text-destructive h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>You have not verified your email</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 md:flex-row"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Email address" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoaderButton isLoading={isPending} type="submit">
            Change email
          </LoaderButton>

          {!emailVerified && (
            <LoaderButton
              variant="secondary"
              type="button"
              isLoading={sendVerifyemailIsPending}
              onClick={() => executeSendVerifyEmail({ email: currentEmail })}
            >
              Verify
            </LoaderButton>
          )}
        </form>
      </Form>
    </div>
  )
}
