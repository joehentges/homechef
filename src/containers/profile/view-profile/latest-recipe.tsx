import Link from "next/link"
import { CookingPotIcon } from "lucide-react"

import { PrimaryKey } from "@/types"

interface LatestRecipeProps {
  id: PrimaryKey
  photo: string | null
  title: string
  description: string | null
}

export function LatestRecipe(props: LatestRecipeProps) {
  const { id, photo, title, description } = props
  return (
    <div className="w-full p-2 sm:w-1/2 md:w-1/3">
      <div className="group rounded-2xl p-4 transition-colors hover:bg-primary/20 dark:hover:bg-primary/10">
        <Link href={`/recipes/${id}`}>
          <div className="items-center justify-items-center space-y-4 rounded-2xl text-center">
            {!!photo ? (
              <div
                className="h-[150px] w-[150px] rounded-2xl bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${photo}')`,
                }}
              />
            ) : (
              <div className="h-[150px] w-[150px] rounded-2xl bg-white dark:bg-black">
                <div className="relative h-full w-full rounded-2xl bg-primary/30">
                  <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
                </div>
              </div>
            )}

            <div className="flex w-full flex-col gap-y-2 py-4">
              <p className="text-lg md:text-xl">{title}</p>
              <p className="text-sm md:text-base">{description}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
