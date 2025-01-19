import Link from "next/link"
import { ChefHatIcon, FrownIcon, LinkIcon, PencilLineIcon } from "lucide-react"

import { UserDetails } from "@/types/UserDetails"
import { getAvatarImageUrl } from "@/lib/get-avatar-image-url"

interface ChefCatalogProps {
  chefs: UserDetails[]
}

export function ChefCatalog(props: ChefCatalogProps) {
  const { chefs } = props

  if (chefs.length < 1) {
    return (
      <div className="flex h-[450px] w-full flex-col items-center justify-center gap-y-3 p-6">
        <div className="relative">
          <FrownIcon className="h-16 w-16 text-muted-foreground" />
          <ChefHatIcon className="absolute -top-9 left-[0.5em] h-12 w-12 text-muted-foreground" />
        </div>

        <p className="text-3xl">No Chefs Found</p>
        <p className="max-w-[400px] text-center text-muted-foreground">
          Tell your friends and family to join. We&apos;ll keep track of all
          their recipes, and make them easy to share.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-row flex-wrap items-center">
      {chefs.map((chef) => (
        <div
          className="group w-full p-1 sm:w-1/2 md:p-2 lg:w-1/3 xl:w-1/5 xl:p-3"
          key={chef.id}
        >
          <Link href={`/chefs/${chef.id}`}>
            <div className="relative rounded-2xl bg-white dark:bg-black">
              <div className="absolute h-full w-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div
                className="h-[150px] w-full rounded-t-2xl bg-primary bg-cover bg-center bg-no-repeat md:h-[200px]"
                style={{
                  backgroundImage: `url('${chef.image ? chef.image : getAvatarImageUrl(chef.displayName)}')`,
                }}
              ></div>
              <div className="justify-items-center space-y-3 p-4 text-sm md:text-base">
                <p className="text-base font-bold md:text-xl">
                  {chef.displayName}
                </p>
                <div className="flex w-full flex-row items-center justify-between gap-x-2 text-center">
                  <div className="w-full justify-items-center space-y-1">
                    <LinkIcon className="h-5 w-5" />
                    <p>{chef.userRecipeImportsCount} Imported</p>
                  </div>
                  <div className="w-full justify-items-center space-y-1">
                    <PencilLineIcon className="h-5 w-5" />
                    <p>{chef.userRecipeCount} Created</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
