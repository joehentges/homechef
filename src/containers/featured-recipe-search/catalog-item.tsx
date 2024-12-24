import Link from "next/link"
import { User2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

interface CatalogItemProps {
  href: string
  alternate?: boolean
  image: string
  title: string
  servings: number
  cookTime: string
}

export function CatalogItem(props: CatalogItemProps) {
  const { href, alternate, image, title, servings, cookTime } = props

  return (
    <Link
      href={href}
      className="group flex w-full flex-row items-center lg:min-w-[325px] lg:max-w-[350px]"
    >
      <div
        className="z-10 h-24 w-32 rounded-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${image}')`,
        }}
      >
        <div className="h-full w-full rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
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
                      className={cn(
                        "h-4 w-4 transition-colors group-hover:text-foreground/80",
                        alternate && "group-hover:text-background/80"
                      )}
                    />
                  ))
              )}
            </div>
          </div>
          <div className="w-full space-y-2">
            <p>Cook Time</p>
            <p
              className={cn(
                "font-bold transition-colors group-hover:text-foreground/80",
                alternate && "group-hover:text-background/80"
              )}
            >
              {cookTime}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
