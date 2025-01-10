import Link from "next/link"
import { CookingPotIcon, User2Icon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import { formatTime } from "@/lib/format-time"
import { cn } from "@/lib/utils"

interface CatalogItemProps {
  recipe: Recipe
  alternate?: boolean
}

export function CatalogItem(props: CatalogItemProps) {
  const { recipe, alternate } = props
  const { id, photo, title, servings, cookTime, prepTime } = recipe
  const servingsNum = parseInt(servings)

  function getServings() {
    if (Number.isNaN(servingsNum)) {
      return (
        <div className="gap-x-2e flex items-center gap-x-1">
          <p>Uknown</p>
          <User2Icon
            className={cn(
              "h-4 w-4 transition-colors group-hover:text-foreground/80",
              alternate && "group-hover:text-background/80"
            )}
          />
        </div>
      )
    }
    if (servingsNum > 5) {
      return (
        <div className="gap-x-2e flex items-center gap-x-1">
          <p>{servingsNum}</p>
          <User2Icon
            className={cn(
              "h-4 w-4 transition-colors group-hover:text-foreground/80",
              alternate && "group-hover:text-background/80"
            )}
          />
        </div>
      )
    }

    return new Array(servingsNum)
      .fill(null)
      .map((_, index) => (
        <User2Icon
          key={index}
          className={cn(
            "h-4 w-4 transition-colors group-hover:text-foreground/80",
            alternate && "group-hover:text-background/80"
          )}
        />
      ))
  }

  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex w-full flex-row items-center lg:min-w-[325px] lg:max-w-[350px]"
    >
      {!!photo ? (
        <div
          className="z-10 h-24 w-28 rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${photo}')`,
          }}
        >
          <div className="h-full w-full rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ) : (
        <div className="z-10 h-24 w-28 rounded-full bg-white dark:bg-black">
          <div className="relative h-full w-full rounded-full bg-primary/30 transition-colors group-hover:bg-primary/40">
            <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "-ml-12 w-full space-y-2 rounded-3xl py-4 pl-16 pr-4",
          alternate
            ? "bg-black text-background dark:bg-white"
            : "bg-white dark:bg-black"
        )}
      >
        <p
          className={cn(
            "text-base font-bold transition-colors group-hover:text-foreground/80 md:text-xl",
            alternate && "group-hover:text-background/80"
          )}
        >
          {title}
        </p>
        <div className="flex flex-row text-xs md:text-sm">
          <div className="w-full space-y-2">
            <p>Servings</p>
            <div className="flex">{getServings()}</div>
          </div>
          <div className="w-full space-y-2">
            <p>Cook Time</p>
            <p
              className={cn(
                "font-bold transition-colors group-hover:text-foreground/80",
                alternate && "group-hover:text-background/80"
              )}
            >
              {formatTime(cookTime + prepTime)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
