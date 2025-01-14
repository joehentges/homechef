"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DicesIcon, RotateCcwIcon } from "lucide-react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"
import { useServerAction } from "zsa-react"

import { PrimaryKey } from "@/types"
import { OrderBy } from "@/types/SearchRecipes"
import { Recipe } from "@/db/schemas"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Catalog } from "@/components/catalog"
import { LoaderButton } from "@/components/loader-button"
import { useDebounce } from "@/hooks/use-debounce"
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
  userId?: PrimaryKey
}

export function RecipeSearch(props: RecipeSearchProps) {
  const {
    recipesPerPageLimit,
    randomRecipe,
    initialRecipes,
    initialRecipesCount,
    availableTags,
    userId,
  } = props
  const { toast } = useToast()

  const [recipesResult, setRecipesResult] = useState<Recipe[]>(initialRecipes)
  const [recipesCount, setRecipesCount] = useState<number>(initialRecipesCount)
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(initialRecipesCount / recipesPerPageLimit)
  )

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [orderBy, setOrderBy] = useQueryState<OrderBy>(
    "orderBy",
    parseAsStringEnum(["newest", "easiest", "fastest"]).withDefault("newest")
  )
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const debouncedSearch = useDebounce(search, 500)

  const { execute, isPending } = useServerAction(searchRecipesAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      setRecipesResult(data.recipes)
      setRecipesCount(data.count)
      setPageCount(Math.ceil(data.count / recipesPerPageLimit))
    },
  })

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch) {
        setRecipesResult(initialRecipes)
        setRecipesCount(initialRecipesCount)
        setPageCount(Math.ceil(initialRecipesCount / recipesPerPageLimit))
        return
      }
      execute({
        search: debouncedSearch,
        tags,
        orderBy,
        recipesPerPageLimit,
        page,
        userId,
      })
    }

    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, tags.length, orderBy])

  function onTagsChange(newTags: string[]) {
    setTags(newTags)
    execute({
      search: debouncedSearch,
      tags: newTags,
      orderBy,
      recipesPerPageLimit,
      page,
      userId,
    })
  }

  function onSortByChange(newSortBy: OrderBy) {
    setOrderBy(newSortBy)
    execute({
      search: debouncedSearch,
      tags,
      orderBy: newSortBy,
      recipesPerPageLimit,
      page,
      userId,
    })
  }

  const { execute: executePageChange, isPending: isPageChangePending } =
    useServerAction(searchRecipesAction, {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        })
      },
      onSuccess({ data }) {
        setPage(data.page)
        setRecipesResult(data.recipes)
        setRecipesCount(data.count)
        setPageCount(Math.ceil(data.count / recipesPerPageLimit))
      },
    })

  function onResetSubmit() {
    setSearch("")
    setTags([])
    setOrderBy("newest")
    setPage(1)
    execute({
      search: "",
      tags: [],
      orderBy: "newest",
      recipesPerPageLimit,
      page: 1,
      userId,
    })
  }

  function onPageChange(page: number) {
    executePageChange({
      search,
      tags,
      orderBy,
      recipesPerPageLimit,
      page,
      userId,
    })
  }

  return (
    <div className="py-10">
      <div className="container space-y-8 rounded-3xl bg-primary/20 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-4xl font-bold">
            Recipe Search <span className="text-2xl">({recipesCount})</span>
          </p>
          {randomRecipe && (
            <Link href={`/recipes/${randomRecipe.id}`}>
              <Button className="rounded-3xl" variant="secondary">
                <DicesIcon /> Surprise me
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="w-full">
            <Input search={search} onChange={setSearch} />
          </div>

          <div className="w-full">
            <TagSelect
              tags={tags}
              availableTags={availableTags}
              onChange={onTagsChange}
            />
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row lg:w-auto">
            <div className="w-full lg:w-auto">
              <SortBySelect orderBy={orderBy} onChange={onSortByChange} />
            </div>

            <div className="flex w-full gap-4 md:flex-row">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span>
                      <LoaderButton
                        isLoading={isPending || isPageChangePending}
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
        </div>
        <div className="center flex w-full justify-center">
          <Catalog
            items={recipesResult}
            pageCount={pageCount}
            currentPage={page}
            onPageClicked={onPageChange}
          />
        </div>
      </div>
    </div>
  )
}
