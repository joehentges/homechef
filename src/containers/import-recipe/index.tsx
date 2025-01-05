"use client"

import { redirect } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const importRecipeFormSchema = z.object({
  url: z.string().min(1).url(),
})

export function ImportRecipe() {
  const form = useForm<z.infer<typeof importRecipeFormSchema>>({
    resolver: zodResolver(importRecipeFormSchema),
    defaultValues: {
      url: "",
    },
  })

  function onSubmit(values: z.infer<typeof importRecipeFormSchema>) {
    redirect(`/recipes/import?url=${values.url}`)
  }

  return (
    <div
      className="container flex flex-col items-center gap-6 md:flex-row"
      id="import-recipe"
    >
      <div className="w-full space-y-2 text-center md:text-start">
        <p className="font-header text-4xl font-bold">Grab any recipe</p>
        <p>
          Remove the unnecesary details, just get the ingredients and
          directions.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-row gap-x-2"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Paste the recipe URL"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Get recipe</Button>
        </form>
      </Form>
    </div>
  )
}
