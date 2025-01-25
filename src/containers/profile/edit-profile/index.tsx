"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MoveLeftIcon } from "lucide-react"
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
import { AutosizeTextarea } from "@/components/autosize-textarea"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { updateProfileAction } from "../actions"
import { EditImage } from "./edit-image"

interface EditProfileProps {
  currentUser: User
  onBackButtonClicked: () => void
}

const updateProfileActionSchema = z.object({
  displayName: z.string().min(3).max(25),
  image: z.string().url().nullable(),
  summary: z.string().min(3).max(300).nullable(),
  featuredRecipeId: z.number().nullable(),
})

export function EditProfile(props: EditProfileProps) {
  const { currentUser, onBackButtonClicked } = props
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
      onBackButtonClicked()
    },
  })

  const form = useForm<z.infer<typeof updateProfileActionSchema>>({
    resolver: zodResolver(updateProfileActionSchema),
    defaultValues: {
      displayName: currentUser.displayName,
      image: currentUser.image,
      summary: currentUser.summary,
      featuredRecipeId: currentUser.featuredRecipeId,
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
          <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditImage
                      displayName={form.getValues().displayName}
                      image={field.value}
                      setImage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex h-full w-full flex-col justify-between space-y-2 md:space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Display name"
                        type="text"
                        className="md:h-12 md:text-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <AutosizeTextarea
                        defaultValue={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Summary"
                        className="md:text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
  return <p>edit</p>
}
