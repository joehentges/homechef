"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { DicesIcon, RotateCcwIcon } from "lucide-react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsStringEnum(["newest", "easiest", "fastest"]).withDefault("newest")
  )
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const { execute, isPending } = useServerAction(searchRecipesAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      if (data.recipes.length < 1) {
        toast({
          title: "Sorry, we couldn't find any recipes",
          description: "Change your search to and we'll take a look again",
          variant: "destructive",
        })
      } else {
        toast({
          title: `Successfully found ${data.count} recipe${data.count > 1 ? "s" : ""}`,
          description: `Take a look at the recipe${data.count > 1 ? "s" : ""} we found.`,
        })
      }

      setRecipesResult(data.recipes)
      setPageCount(Math.ceil(data.count / recipesPerPageLimit))
    },
  })

  const form = useForm<z.infer<typeof recipeSearchFormSchema>>({
    resolver: zodResolver(recipeSearchFormSchema),
    defaultValues: {
      search: search,
      tags: tags,
      sortBy: sortBy,
      recipesPerPageLimit,
      page: page,
    },
  })

  function onSubmit(values: z.infer<typeof recipeSearchFormSchema>) {
    execute(values)
  }

  function onResetSubmit() {
    setSearch("")
    setTags([])
    setSortBy("newest")
    setPage(1)
    execute({
      search: "",
      tags: [],
      sortBy: "newest",
      recipesPerPageLimit,
      page: 1,
    })
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
                    <Input
                      search={search}
                      setSearch={setSearch}
                      onChange={field.onChange}
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
                      tags={tags}
                      setTags={setTags}
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
                      <SortBySelect
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-4 md:flex-row">
                <LoaderButton
                  isLoading={isPending}
                  type="submit"
                  className="w-full rounded-3xl px-6 lg:w-auto"
                >
                  Search
                </LoaderButton>

                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span>
                        <LoaderButton
                          isLoading={isPending}
                          onClick={onResetSubmit}
                          className="w-full rounded-full lg:w-auto"
                          variant="destructive"
                          hideChildrenWhileLoading
                        >
                          <RotateCcwIcon />
                        </LoaderButton>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset your search</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
