"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { DicesIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Recipe } from "@/db/schemas"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Catalog } from "@/components/catalog"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { searchRecipesAction } from "./actions"
import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

interface RecipeSearchProps {
  recipesPerPageLimit: number
  randomRecipe?: Recipe
  initialRecipes: Recipe[]
  initialRecipesCount: number
  availableTags: { name: string }[]
}

const recipeSearchFormSchema = z.object({
  search: z.string(),
  tags: z.array(z.string()),
  sortBy: z.enum(["newest", "easiest", "fastest"]),
  recipesPerPageLimit: z.number(),
  page: z.number().default(1),
})

export function RecipeSearch(props: RecipeSearchProps) {
  const {
    recipesPerPageLimit,
    randomRecipe,
    initialRecipes,
    initialRecipesCount,
    availableTags,
  } = props
  const { toast } = useToast()

  const [recipesResult, setRecipesResult] = useState<Recipe[]>(initialRecipes)
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(initialRecipesCount / recipesPerPageLimit)
  )

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: {
      defaultValue: "newest",
      parse: (value) => value.toLowerCase() || "newest",
    },
    tags: {
      defaultValue: [],
      parse: (value) => value.split(",").map((tag) => tag) || "",
    },
    page: {
      defaultValue: 1,
      parse: (value) => {
        const parsedValue = parseInt(value, 10)
        return isNaN(parsedValue) ? null : parsedValue
      },
      serialize: (value) => value?.toString() || "",
    },
  })

  const { execute, isPending } = useServerAction(searchRecipesAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      toast({
        title: `Successfully found some recipes`,
        description: `Take a look at the recipes we found.`,
      })
      setRecipesResult(data.recipes)
      setPageCount(Math.ceil(data.count / recipesPerPageLimit))
    },
  })

  const form = useForm<z.infer<typeof recipeSearchFormSchema>>({
    resolver: zodResolver(recipeSearchFormSchema),
    defaultValues: {
      search: searchValues.search,
      tags: searchValues.tags,
      sortBy: searchValues.sortBy as "newest" | "easiest" | "fastest",
      recipesPerPageLimit,
      page: searchValues.page,
    },
  })

  function onSubmit(values: z.infer<typeof recipeSearchFormSchema>) {
    execute(values)
  }

  return (
    <div className="py-10">
      <div className="container space-y-8 rounded-3xl bg-primary/20 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-4xl font-bold">Recipe Search</p>
          {randomRecipe && (
            <Link href={`/recipes/${randomRecipe.id}`}>
              <Button className="rounded-3xl" variant="secondary">
                <DicesIcon /> Surprise me
              </Button>
            </Link>
          )}
        </div>
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
                    <Input onChange={field.onChange} />
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
                isLoading={isPending}
                type="submit"
                className="w-full rounded-3xl px-6 lg:w-auto"
              >
                Search
              </LoaderButton>
            </div>
          </form>
        </Form>
        <div className="center flex w-full justify-center">
          <Catalog items={recipesResult} pageCount={pageCount} />
        </div>
      </div>
    </div>
  )
}
