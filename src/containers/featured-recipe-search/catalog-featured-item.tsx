import Link from "next/link"
import { User2Icon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import { formatTime } from "@/lib/format-time"

interface CatalogFeaturedItemProps {
  recipe: Recipe
}

export function CatalogFeaturedItem(props: CatalogFeaturedItemProps) {
  const { recipe } = props
  const { id, photo, title, description, servings, cookTime, prepTime } = recipe
  const servingsNum = parseInt(servings)

  function getServings() {
    if (Number.isNaN(servingsNum)) {
      return (
        <div className="gap-x-2e flex items-center gap-x-1">
          <p>Uknown</p>
          <User2Icon
            className={
              "h-4 w-4 transition-colors group-hover:text-foreground/80"
            }
          />
        </div>
      )
    }
    if (servingsNum > 5) {
      return (
        <div className="gap-x-2e flex items-center gap-x-1">
          <p>{servingsNum}</p>
          <User2Icon
            className={
              "h-4 w-4 transition-colors group-hover:text-foreground/80"
            }
          />
        </div>
      )
    }

    return new Array(servingsNum)
      .fill(null)
      .map((_, index) => (
        <User2Icon
          key={index}
          className={"h-4 w-4 transition-colors group-hover:text-foreground/80"}
        />
      ))
  }

  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex w-full max-w-[750px] flex-col gap-x-4 rounded-3xl bg-white dark:bg-black md:flex-row"
    >
      <div
        className="h-full min-h-[200px] w-full rounded-t-3xl bg-cover bg-center bg-no-repeat md:rounded-l-3xl"
        style={{
          backgroundImage: `url('${photo}')`,
        }}
      >
        <div className="h-full w-full rounded-l-3xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex w-full flex-col justify-between gap-y-6 p-6">
        <div className="flex flex-col gap-y-6">
          <p className="text-xl font-bold transition-colors group-hover:text-foreground/80 md:text-3xl">
            {title}
          </p>
          <p className="text-xs md:text-sm">{description}</p>
        </div>

        <div className="flex flex-row text-xs md:text-sm">
          <div className="w-full space-y-2">
            <p>Servings</p>
            <div className="flex">{getServings()}</div>
          </div>
          <div className="w-full space-y-2">
            <p>Cook Time</p>
            <p className="font-bold transition-colors group-hover:text-foreground/80">
              {formatTime(cookTime + prepTime)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
