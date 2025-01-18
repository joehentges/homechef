import Link from "next/link"
import { LinkIcon, PencilLineIcon } from "lucide-react"

import { FeaturedUser } from "@/types/FeaturedUser"

interface FeaturedChefs {
  chefs: FeaturedUser[]
}

export function FeaturedChefs(props: FeaturedChefs) {
  const { chefs } = props

  return (
    <div className="bg-primary/20 py-10">
      <div className="container">
        <p className="font-header text-4xl font-bold">Featured Chefs</p>
        <div className="flex flex-row flex-wrap px-4 py-4">
          {chefs.map((chef) => (
            <div
              className="group w-full p-2 sm:w-1/2 lg:w-1/3 xl:w-1/5"
              key={chef.id}
            >
              <Link href="/">
                <div className="relative rounded-2xl bg-white dark:bg-black">
                  <div className="absolute h-full w-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div
                    className="h-[150px] w-full rounded-t-2xl bg-cover bg-center bg-no-repeat md:h-[200px]"
                    style={{
                      backgroundImage: chef.image
                        ? `url('${chef.image}')`
                        : `url('https://api.dicebear.com/9.x/initials/svg?seed=${chef.displayName}')`,
                    }}
                  ></div>
                  <div className="justify-items-center space-y-1 p-4 text-sm md:text-base">
                    <p className="text-base font-bold md:text-xl">
                      {chef.displayName}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <LinkIcon className="h-4 w-4" />
                      <p>
                        {chef.userRecipeImportsCount} recipe
                        {chef.userRecipeImportsCount == 1 ? "" : "s"} imported
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <PencilLineIcon className="h-4 w-4" />
                      <p>
                        {chef.userRecipeCount} recipe
                        {chef.userRecipeCount == 1 ? "" : "s"} created
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
