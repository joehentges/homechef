import Link from "next/link"
import { CookingPotIcon, User2Icon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import { formatTime } from "@/lib/format-time"
import { cn } from "@/lib/utils"

interface RecipeCatalogItemProps {
  recipe: Recipe
  alternate?: boolean
}

export function RecipeCatalogItem(props: RecipeCatalogItemProps) {
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
              "group-hover:text-foreground/80 h-4 w-4 transition-colors",
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
              "group-hover:text-foreground/80 h-4 w-4 transition-colors",
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
            "group-hover:text-foreground/80 h-4 w-4 transition-colors",
            alternate && "group-hover:text-background/80"
          )}
        />
      ))
  }

  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex w-full flex-row items-center"
    >
      {!!photo ? (
        <div
          className="z-10 h-24 w-28 rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${photo}')`,
          }}
        >
          <div className="bg-primary/10 h-full w-full rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ) : (
        <div className="z-10 h-24 w-28 rounded-full bg-white dark:bg-black">
          <div className="bg-primary/30 group-hover:bg-primary/40 relative h-full w-full rounded-full transition-colors">
            <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "-ml-12 w-full space-y-2 rounded-3xl py-4 pr-4 pl-16",
          alternate
            ? "text-background bg-black dark:bg-white"
            : "bg-white dark:bg-black"
        )}
      >
        <p
          className={cn(
            "group-hover:text-foreground/80 text-base font-bold transition-colors md:text-xl",
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
                "group-hover:text-foreground/80 font-bold transition-colors",
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
