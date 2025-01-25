import { CookingPotIcon } from "lucide-react"

interface FeaturedRecipeOptionProps {
  photo: string | null
  title: string
  description: string | null
}

export function FeaturedRecipeOption(props: FeaturedRecipeOptionProps) {
  const { photo, title, description } = props
  return (
    <div className="hover:bg-primary/20 dark:hover:bg-primary/10 justify-self-center rounded-2xl transition-colors">
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
            <div className="bg-primary/30 relative h-full w-full rounded-2xl">
              <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
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
