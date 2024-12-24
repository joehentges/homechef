import {
  CatalogFeaturedItem,
  CatalogFeaturedItemProps,
} from "./catalog-featured-item"
import { CatalogItem } from "./catalog-item"
import { CatalogPagination } from "./catalog-pagination"

export interface CatalogProps {
  items: CatalogFeaturedItemProps[]
  pageCount: number
}

export function Catalog(props: CatalogProps) {
  const { items, pageCount } = props

  const catalogFeaturedItem = items[0]

  if (!catalogFeaturedItem) {
    return <p>None found</p>
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <CatalogFeaturedItem
          href={catalogFeaturedItem.href}
          image={catalogFeaturedItem.image}
          title={catalogFeaturedItem.title}
          description={catalogFeaturedItem.description}
          servings={catalogFeaturedItem.servings}
          cookTime={catalogFeaturedItem.cookTime}
        />
        <div className="flex flex-col justify-center gap-y-4">
          {items.slice(1, 3).map((item, index) => (
            <CatalogItem
              key={`${item.title}-${index}`}
              alternate={index === 0}
              href={item.href}
              image={item.image}
              title={item.title}
              servings={item.servings}
              cookTime={item.cookTime}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-row flex-wrap justify-between gap-4">
        {items.slice(3).map((item, index) => (
          <CatalogItem
            key={`${item.title}-${index}`}
            alternate={index === 1}
            href={item.href}
            image={item.image}
            title={item.title}
            servings={item.servings}
            cookTime={item.cookTime}
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
