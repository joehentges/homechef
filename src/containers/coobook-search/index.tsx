"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { DicesIcon, PencilLineIcon } from "lucide-react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

import { RecipeWithTags } from "@/types/Recipe"
import { SortBy } from "@/types/SortBy"
import { Recipe } from "@/db/schemas"
import { Button } from "@/components/ui/button"
import { Catalog } from "@/components/catalog"

import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

interface UserRecipeSearchProps {
  randomRecipe?: RecipeWithTags
  recipes: RecipeWithTags[]
  recipesPerPageLimit: number
  availableTags: { name: string }[]
}

export function UserRecipeSearch(props: UserRecipeSearchProps) {
  const { randomRecipe, recipes, recipesPerPageLimit, availableTags } = props

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [sortBy, setSortBy] = useQueryState<SortBy>(
    "sortBy",
    parseAsStringEnum(["newest", "easiest", "fastest"]).withDefault("newest")
  )
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const { catalogPageItems, totalCatalogItems } = useMemo(() => {
    const sortByNewestFunction = (a: Recipe, b: Recipe) =>
      new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
    const sortByFastestFunction = (a: Recipe, b: Recipe) =>
      a.prepTime + a.cookTime - (b.prepTime + b.cookTime)
    const difficultySortOrder = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
      null: 3,
    }
    const sortByEasiestFunction = (a: Recipe, b: Recipe) =>
      difficultySortOrder[a.difficulty ?? "null"] -
      difficultySortOrder[b.difficulty ?? "null"]

    const catalogItems = recipes
      .filter((recipe) => {
        let matchesTags = true
        if (tags.length > 0) {
          matchesTags = recipe.tags.some((tag) =>
            tags.find((searchTag) => searchTag === tag)
          )
        }
        let matchesTitleOrDescription = true
        if (!!search) {
          matchesTitleOrDescription = recipe.title
            .toLowerCase()
            .includes(search)
          if (!matchesTitleOrDescription) {
            matchesTitleOrDescription =
              recipe.description?.toLowerCase().includes(search) ?? false
          }
        }
        return matchesTags && matchesTitleOrDescription
      })
      .sort(
        sortBy === "easiest"
          ? sortByEasiestFunction
          : sortBy === "fastest"
            ? sortByFastestFunction
            : sortByNewestFunction
      )

    return {
      catalogPageItems: catalogItems.slice(
        (page - 1) * recipesPerPageLimit,
        page * recipesPerPageLimit
      ),
      totalCatalogItems: catalogItems.length,
    }
    // eslint-disable-next-line
  }, [search, tags, sortBy, page])

  const recipePageCount = Math.ceil(totalCatalogItems / recipesPerPageLimit)

  useEffect(() => {
    if (totalCatalogItems > 0 && catalogPageItems.length === 0) {
      setPage(1)
    }
    // eslint-disable-next-line
  }, [search, tags, sortBy, page])

  return (
    <div className="container space-y-8 rounded-3xl bg-primary/20 py-8">
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
        <p className="text-4xl font-bold">
          Cookbook Search{" "}
          <span className="text-2xl">({totalCatalogItems})</span>
        </p>
        <div className="flex flex-row gap-x-4">
          <Link href="/recipes/create">
            <Button className="rounded-3xl">
              <PencilLineIcon /> Create
            </Button>
          </Link>
          {randomRecipe && (
            <Link href={`/recipes/${randomRecipe.id}`}>
              <Button className="rounded-3xl" variant="secondary">
                <DicesIcon /> Surprise Me
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <Input search={search} setSearch={setSearch} />

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <TagSelect
            availableTags={availableTags}
            tags={tags}
            setTags={setTags}
          />

          <SortBySelect sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <div className="center flex w-full justify-center">
        <Catalog
          items={catalogPageItems}
          pageCount={recipePageCount}
          currentPage={page}
          onPageClicked={setPage}
        />
      </div>
    </div>
  )
}
