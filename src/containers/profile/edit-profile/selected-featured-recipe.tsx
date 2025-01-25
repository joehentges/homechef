import { CookingPotIcon } from "lucide-react"

interface SelectedFeaturedRecipeProps {
  photo: string | null
  title: string
  description: string | null
}

export function SelectedFeaturedRecipe(props: SelectedFeaturedRecipeProps) {
  const { photo, title, description } = props
  return (
    <div className="justify-self-center rounded-2xl transition-colors md:w-3/4">
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
            <div className="bg-primary/30 relative h-full w-full rounded-2xl">
              <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
            </div>
          </div>
        )}
        <div className="flex w-full flex-col gap-y-2 py-4">
          <p className="text-center text-lg font-bold md:text-start md:text-xl">
            {title}
          </p>
          <p className="text-center text-sm md:text-start md:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
