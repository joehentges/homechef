import { FrownIcon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import { cn } from "@/lib/utils"

import { CatalogFeaturedItem } from "./catalog-featured-item"
import { CatalogItem } from "./catalog-item"
import { CatalogPagination } from "./catalog-pagination"

export interface CatalogProps {
  items: Recipe[]
  pageCount: number
}

export function Catalog(props: CatalogProps) {
  const { items, pageCount } = props

  function findAndRemoveFirstWithDescription() {
    const remainingItems = [...items]

    for (let i = 0; i < remainingItems.length; i++) {
      const item = remainingItems[i]
      if (item && item.description !== undefined && item.description !== null) {
        const removedObject = remainingItems.splice(i, 1)[0]
        return { catalogFeaturedItem: removedObject, remainingItems }
      }
    }

    return { catalogFeaturedItem: undefined, remainingItems }
  }

  const { catalogFeaturedItem, remainingItems } =
    findAndRemoveFirstWithDescription()

  if (!catalogFeaturedItem) {
    return (
      <div className="flex h-[450px] w-full flex-col items-center justify-center gap-y-3 p-6">
        <FrownIcon className="h-16 w-16 text-muted-foreground" />
        <p className="text-3xl">No Recipes Found</p>
        <p className="text-muted-foreground">Add or Import Some Recipes</p>
      </div>
    )
  }

  return (
    <div className="flex max-w-[1115px] flex-col gap-y-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <CatalogFeaturedItem recipe={catalogFeaturedItem} />
        <div
          className={cn(
            "flex flex-col gap-y-4",
            items.length > 2 ? "justify-center" : ""
          )}
        >
          {remainingItems.slice(0, 2).map((item, index) => (
            <CatalogItem
              key={`${item.title}-${index}`}
              alternate={index === 0}
              recipe={item}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-4">
        {remainingItems.slice(2).map((item, index) => (
          <CatalogItem
            key={`${item.title}-${index}`}
            alternate={index % 4 === 2}
            recipe={item}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="py-4">
          <CatalogPagination pageCount={4} />
        </div>
      )}
    </div>
  )
}
