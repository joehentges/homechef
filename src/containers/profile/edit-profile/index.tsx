"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MoveLeftIcon } from "lucide-react"
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
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { updateProfileAction } from "../actions"

interface EditProfileProps {
  onBackButtonClicked: () => void
}

const updateProfileActionSchema = z.object({
  displayName: z.string().min(3),
})

export function EditProfile(props: EditProfileProps) {
  const { onBackButtonClicked } = props
  const { toast } = useToast()

  const { execute, isPending } = useServerAction(updateProfileAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Successfully updated your profile",
        description: "Take a look at your updated profile",
      })
    },
  })

  const form = useForm<z.infer<typeof updateProfileActionSchema>>({
    resolver: zodResolver(updateProfileActionSchema),
    defaultValues: {
      displayName: "",
    },
  })

  function onSubmit(values: z.infer<typeof updateProfileActionSchema>) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="container flex max-w-[1000px] flex-col items-center justify-between gap-y-4 sm:flex-row">
          <div className="flex flex-row items-center gap-x-4">
            <button
              onClick={onBackButtonClicked}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <MoveLeftIcon />
            </button>
            <p className="text-xl">Edit profile</p>
          </div>
          <LoaderButton
            isLoading={isPending}
            disabled={!form.formState.isDirty}
            type="submit"
          >
            Update profile
          </LoaderButton>
        </div>

        <div className="container max-w-[1000px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
          <p>hi</p>
        </div>
      </form>
    </Form>
  )
  return <p>edit</p>
}
