"use client"

import { useQueryStates } from "nuqs"

import { Recipe } from "@/db/schemas"

import { Catalog } from "./catalog"
import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

type FeaturedRecipe = Recipe & { tags: string[] }

interface FeaturedRecipeSearch {
  recipes: FeaturedRecipe[]
}

export function FeaturedRecipeSearch(props: FeaturedRecipeSearch) {
  const { recipes } = props

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: { defaultValue: "Newest", parse: (value) => value || "Newest" },
    tag: { defaultValue: "", parse: (value) => value || "" },
    page: { defaultValue: "1", parse: (value) => value || "1" },
  })
  console.log(searchValues)

  function extractUniqueTags(
    recipes: FeaturedRecipe[],
    limit: number = 5
  ): string[] {
    const uniqueTags = new Set<string>()

    for (const item of recipes) {
      for (const tag of item.tags) {
        if (uniqueTags.size < limit) {
          uniqueTags.add(tag)
        } else {
          break // Stop adding tags once the limit is reached
        }
      }
      if (uniqueTags.size === limit) break //optimization, break out of outer loop as well
    }

    return [...uniqueTags]
  }

  const catalogTags = extractUniqueTags(recipes)
  const catalogItems = recipes

  return (
    <div className="container" id="featured-recipe-search">
      <div className="flex flex-col items-center justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col items-center gap-x-10 gap-y-6 md:flex-row">
          <p className="w-[200px] font-header text-5xl font-bold">Recipes</p>
          <Input />
        </div>
        <SortBySelect />
      </div>

      <div className="flex flex-col items-start gap-x-10 gap-y-6 pt-6 md:flex-row md:pt-10">
        <TagSelect tags={catalogTags} />
        <Catalog
          items={catalogItems}
          pageCount={Math.ceil(catalogItems.length / 6)}
        />
      </div>
    </div>
  )
}
