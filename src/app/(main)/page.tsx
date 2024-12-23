import { HeartIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { FeaturedRecipeSearch } from "@/containers/featured-recipe-search"

export default function HomePage() {
  return (
    <div>
      <div
        className={cn(
          "relative -mt-20 h-[450px] overflow-hidden rounded-b-[2rem] bg-primary/30 md:h-[600px] md:rounded-b-[4rem]"
        )}
      >
        <div className="absolute left-[15%] top-[80%] flex max-w-[250px] gap-x-3 md:left-[35%] md:top-[28%]">
          <HeartIcon
            fill="white"
            className="h-4 -rotate-45 text-white md:h-8"
          />
          <p className="text-sm md:text-base">
            New pumpkin season has started, let&apos;s cook!
          </p>
        </div>
        <div className="xl:[15em] absolute bottom-0 right-0 hidden md:mr-[5em] md:flex lg:mr-[12em] xl:mr-[15em] 2xl:mr-[25em]">
          <img
            src="/images/halloween-pumpkins.png"
            className="max-h-[450px] max-w-[400px] lg:max-w-[500px] xl:max-w-[550px]"
          />
        </div>

        <div
          className={cn(
            "container flex h-[100%] flex-col items-center justify-center font-header text-6xl font-bold md:items-start md:text-7xl lg:text-8xl xl:text-9xl"
          )}
        >
          <p>Chef</p>
          <p className="md:ml-32">Featured</p>
          <p>Recipes</p>
        </div>
      </div>
      <FeaturedRecipeSearch />
    </div>
  )
}
