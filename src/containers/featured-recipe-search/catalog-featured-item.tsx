import Link from "next/link"
import { User2Icon } from "lucide-react"

export interface CatalogFeaturedItemProps {
  href: string
  image: string
  title: string
  description: string
  servings: number
  cookTime: string
}

export function CatalogFeaturedItem(props: CatalogFeaturedItemProps) {
  const { href, image, title, description, servings, cookTime } = props

  return (
    <Link
      href={href}
      className="group flex w-full flex-col gap-x-4 rounded-3xl bg-white dark:bg-black md:flex-row"
    >
      <div
        className="h-full min-h-[200px] w-full rounded-t-3xl bg-cover bg-center bg-no-repeat md:rounded-l-3xl"
        style={{
          backgroundImage: `url('${image}')`,
        }}
      >
        <div className="h-full w-full rounded-l-3xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex w-full flex-col gap-y-6 p-6">
        <p className="text-xl font-bold transition-colors group-hover:text-foreground/80 md:text-3xl">
          {title}
        </p>
        <p className="text-xs md:text-sm">{description}</p>
        <div className="flex flex-row text-xs md:text-sm">
          <div className="w-full space-y-2">
            <p>Serving</p>
            <div className="flex">
              {servings > 5 ? (
                <div className="gap-x-2e flex items-center gap-x-1">
                  <p>{servings}</p>
                  <User2Icon className="h-4 w-4 transition-colors group-hover:text-foreground/80" />
                </div>
              ) : (
                new Array(servings)
                  .fill(null)
                  .map((_, index) => (
                    <User2Icon
                      key={index}
                      className="h-4 w-4 transition-colors group-hover:text-foreground/80"
                    />
                  ))
              )}
            </div>
          </div>
          <div className="w-full space-y-2">
            <p>Cook Time</p>
            <p className="font-bold transition-colors group-hover:text-foreground/80">
              {cookTime}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
