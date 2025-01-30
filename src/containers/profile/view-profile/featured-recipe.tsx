import Link from "next/link"
import { CookingPotIcon } from "lucide-react"

import { PrimaryKey } from "@/types"

interface FeaturedRecipeProps {
  id: PrimaryKey
  photo: string | null
  title: string
  description: string | null
}

export function FeaturedRecipe(props: FeaturedRecipeProps) {
  const { id, photo, title, description } = props
  return (
    <div className="group justify-self-center rounded-2xl transition-colors hover:bg-primary/20 dark:hover:bg-primary/10 md:w-3/4">
      <Link href={`/recipes/${id}`}>
        <div className="flex flex-col items-center gap-x-4 rounded-2xl p-4 md:flex-row">
          {!!photo ? (
            <div
              className="h-[150px] w-[200px] rounded-2xl bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${photo}')`,
              }}
            />
          ) : (
            <div className="h-[150px] w-[200px] rounded-2xl bg-white dark:bg-black">
              <div className="relative h-full w-full rounded-2xl bg-primary/30">
                <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
              </div>
            </div>
          )}
          <div className="flex w-full flex-col gap-y-2 py-4">
            <p className="text-center text-lg md:text-start md:text-xl">
              {title}
            </p>
            <p className="text-center text-sm md:text-start md:text-base">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
