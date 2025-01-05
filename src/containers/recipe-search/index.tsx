"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryStates } from "nuqs"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/loader-button"

import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

interface RecipeSearchProps {
  availableTags: { name: string }[]
}

const recipeSearchFormSchema = z.object({
  search: z.string(),
  tags: z.array(z.string()),
  sortBy: z.string().min(1),
})

export function RecipeSearch(props: RecipeSearchProps) {
  const { availableTags } = props

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: {
      defaultValue: "Newest",
      parse: (value) => value.toLowerCase() || "Newest",
    },
    tags: {
      defaultValue: [],
      parse: (value) => value.split(",").map((tag) => tag) || "",
    },
    page: { defaultValue: "1", parse: (value) => value || "1" },
  })

  const form = useForm<z.infer<typeof recipeSearchFormSchema>>({
    resolver: zodResolver(recipeSearchFormSchema),
    defaultValues: {
      search: searchValues.search,
      tags: searchValues.tags,
      sortBy: searchValues.sortBy,
    },
  })

  function onSubmit(values: z.infer<typeof recipeSearchFormSchema>) {
    console.log(values)
  }

  return (
    <div className="py-10">
      <div className="container space-y-6 rounded-3xl bg-primary/20 py-8">
        <p className="text-4xl font-bold">Recipe Search</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4 lg:flex-row"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Search for a recipe"
                      className="rounded-2xl bg-white dark:bg-black md:min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <TagSelect
                      availableTags={availableTags}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-col gap-4 md:flex-row lg:w-auto">
              <FormField
                control={form.control}
                name="sortBy"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-auto">
                    <FormControl>
                      <SortBySelect onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoaderButton
                isLoading={false}
                type="submit"
                className="w-full rounded-2xl px-6 lg:w-auto"
              >
                Search
              </LoaderButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
