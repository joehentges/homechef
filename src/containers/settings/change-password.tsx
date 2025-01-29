"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { changePasswordAction } from "./actions"

const changePasswordFormSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function ChangePassword() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { execute, isPending } = useServerAction(changePasswordAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      form.reset()
      toast({
        title: "Successfully changed your password",
        description: "You have successfully changed your password.",
      })
    },
  })

  function onSubmit(values: z.infer<typeof changePasswordFormSchema>) {
    execute(values)
  }

  return (
    <div className="space-y-2">
      <p className="text-lg">Password</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 md:flex-row"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="New password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Confirm new password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoaderButton isLoading={isPending} type="submit">
            Change password
          </LoaderButton>
        </form>
      </Form>
    </div>
  )
}
