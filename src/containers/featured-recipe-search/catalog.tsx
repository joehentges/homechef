import { Recipe } from "@/db/schemas"

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
    return <p>None found</p>
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <CatalogFeaturedItem recipe={catalogFeaturedItem} />
        <div className="flex flex-col justify-center gap-y-4">
          {remainingItems.slice(0, 2).map((item, index) => (
            <CatalogItem
              key={`${item.title}-${index}`}
              alternate={index === 0}
              recipe={item}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-row flex-wrap justify-between gap-4">
        {remainingItems.slice(2).map((item, index) => (
          <CatalogItem
            key={`${item.title}-${index}`}
            alternate={index === 1}
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
