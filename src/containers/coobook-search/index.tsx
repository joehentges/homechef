"use client"

import { useMemo } from "react"
import Link from "next/link"
import { DicesIcon } from "lucide-react"
import { useQueryStates } from "nuqs"

import { RecipeWithTags } from "@/types/Recipe"
import { Recipe } from "@/db/schemas"
import { Button } from "@/components/ui/button"
import { Catalog } from "@/components/catalog"

import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

interface UserRecipeSearchProps {
  recipes: RecipeWithTags[]
  recipesPerPageLimit: number
  availableTags: { name: string }[]
}

export function UserRecipeSearch(props: UserRecipeSearchProps) {
  const { recipes, recipesPerPageLimit, availableTags } = props

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: {
      defaultValue: "newest",
      parse: (value) => value.toLowerCase() || "newest",
    },
    tags: {
      defaultValue: "",
      parse: (value) => value.toLowerCase() || "",
    },
    page: { defaultValue: "1", parse: (value) => value || "1" },
  })

  const tagsParsed = !!searchValues.tags ? searchValues.tags.split(",") : []

  const page = (parseInt(searchValues.page) ?? 1) - 1 // want to start with 0 instead of one

  const sortByNewestFunction = (a: Recipe, b: Recipe) =>
    b.dateUpdated.getTime() - a.dateUpdated.getTime()
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

  const { catalogPageItems, totalCatalogItems } = useMemo(() => {
    const catalogItems = recipes
      .filter((recipe) => {
        let matchesTags = true
        if (tagsParsed.length > 0) {
          matchesTags = recipe.tags.some((tag) =>
            tagsParsed.find((searchTag) => searchTag === tag)
          )
        }
        let matchesTitleOrDescription = true
        if (!!searchValues.search) {
          matchesTitleOrDescription = recipe.title
            .toLowerCase()
            .includes(searchValues.search)
          if (!matchesTitleOrDescription) {
            matchesTitleOrDescription =
              recipe.description?.toLowerCase().includes(searchValues.search) ??
              false
          }
        }
        return matchesTags && matchesTitleOrDescription
      })
      .sort(
        searchValues.sortBy === "easiest"
          ? sortByEasiestFunction
          : searchValues.sortBy === "fastest"
            ? sortByFastestFunction
            : sortByNewestFunction
      )

    return {
      catalogPageItems: catalogItems.slice(
        page * recipesPerPageLimit,
        (page + 1) * recipesPerPageLimit
      ),
      totalCatalogItems: catalogItems.length,
    }
  }, [recipes, searchValues, page])

  const recipePageCount = Math.ceil(totalCatalogItems / recipesPerPageLimit)
  console.log(recipePageCount)

  return (
    <div className="py-10">
      <div className="container space-y-8 rounded-3xl bg-primary/20 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-4xl font-bold">Cookbook Search</p>
          {recipes.length > 0 && (
            <Link
              href={`/recipes/${recipes[Math.floor(Math.random() * recipes.length)].id}`}
            >
              <Button className="rounded-3xl" variant="secondary">
                <DicesIcon /> Surprise Me
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <Input />

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TagSelect availableTags={availableTags} />

            <SortBySelect />
          </div>
        </div>
        <div className="center flex w-full justify-center">
          <Catalog items={catalogPageItems} pageCount={recipePageCount} />
        </div>
      </div>
    </div>
  )
}
