import { FrownIcon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import { cn } from "@/lib/utils"

import { CatalogFeaturedItem } from "./catalog-featured-item"
import { CatalogItem } from "./catalog-item"
import { CatalogPagination } from "./catalog-pagination"

export interface CatalogProps {
  items: Recipe[]
  pageCount: number
  currentPage: number
  onPageClicked: (page: number) => void
}

export function Catalog(props: CatalogProps) {
  const { items, pageCount, currentPage, onPageClicked } = props

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
        <p className="max-w-[350px] text-center text-muted-foreground">
          Change your search, or add or import some recipes. We&apos;ll keep
          track of them for you.
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-[1115px] flex-col gap-y-2">
      <div className="flex h-full w-full flex-col justify-center lg:flex-row">
        <div className="w-full p-2 lg:w-2/3">
          <CatalogFeaturedItem recipe={catalogFeaturedItem} />
        </div>

        <div
          className={cn(
            "flex w-full flex-col lg:w-1/3",
            remainingItems.length > 1 ? "justify-center" : ""
          )}
        >
          {remainingItems.slice(0, 2).map((item, index) => (
            <div className="p-2" key={`${item.title}-${index}`}>
              <CatalogItem alternate={index === 0} recipe={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-full flex-col flex-wrap lg:flex-row">
        {remainingItems.slice(2).map((item, index) => (
          <div
            className="w-full self-center p-2 lg:w-1/3"
            key={`${item.title}-${index}`}
          >
            <CatalogItem alternate={index % 4 === 2} recipe={item} />
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="py-4">
          <CatalogPagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageClicked={onPageClicked}
          />
        </div>
      )}
    </div>
  )
}
