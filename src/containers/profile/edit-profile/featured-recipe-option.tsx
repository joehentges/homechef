import { CookingPotIcon } from "lucide-react"

import { Recipe } from "@/db/schemas"

interface FeaturedRecipeOptionProps {
  photo: Recipe["photo"]
  title: Recipe["title"]
  description: Recipe["description"]
}

export function FeaturedRecipeOption(props: FeaturedRecipeOptionProps) {
  const { photo, title, description } = props
  return (
    <div className="justify-self-center rounded-2xl transition-colors hover:bg-primary/20 dark:hover:bg-primary/10">
      <div className="flex flex-col items-center gap-x-4 rounded-2xl px-4 md:flex-row">
        {!!photo ? (
          <div
            className="h-[100px] w-[125px] rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${photo}')`,
            }}
          />
        ) : (
          <div className="h-[100px] w-[125px] rounded-2xl bg-white dark:bg-black">
            <div className="relative h-full w-full rounded-2xl bg-primary/30">
              <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="flex w-full flex-col gap-y-2 py-4">
          <p className="text-center text-base font-bold md:text-start md:text-lg">
            {title}
          </p>
          <p className="text-center text-sm md:text-start">{description}</p>
        </div>
      </div>
    </div>
  )
}
