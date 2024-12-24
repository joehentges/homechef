"use client"

import { useQueryStates } from "nuqs"

import {
  featuredRecipes,
  featuredRecipeTags,
} from "../../../mocks/featured-recipes"
import { Catalog } from "./catalog"
import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

export function FeaturedRecipeSearch() {
  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: { defaultValue: "Newest", parse: (value) => value || "Newest" },
    tag: { defaultValue: "", parse: (value) => value || "" },
    page: { defaultValue: "1", parse: (value) => value || "1" },
  })

  console.log(searchValues)

  const catalogTags = featuredRecipeTags
  const catalogItems = featuredRecipes

  return (
    <div className="container py-8 md:py-16" id="featured-recipe-search">
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
