"use client"

import { useMemo } from "react"
import { CookingPotIcon } from "lucide-react"

import { RecipeDetailsPhoto } from "@/types/Recipe"

interface RecipeImageProps {
  photos?: RecipeDetailsPhoto[]
}

export function RecipeImage(props: RecipeImageProps) {
  const { photos } = props

  function selectPrimaryPhoto(photos: RecipeDetailsPhoto[] | undefined) {
    if (!photos) {
      return
    }

    return (
      photos.find((photo) => photo.defaultPhoto) ??
      photos[Math.floor(Math.random() * photos.length)]
    )
  }
  const primaryPhoto = useMemo(() => selectPrimaryPhoto(photos), [photos])

  if (primaryPhoto) {
    return (
      <div
        className="center h-[250px] w-[350px] max-w-full rounded-2xl bg-cover bg-center bg-no-repeat md:h-[125px] md:w-[175px] md:rounded-l-3xl"
        style={{
          backgroundImage: `url('${primaryPhoto.photoUrl}')`,
        }}
      />
    )
  }

  return (
    <div className="center relative h-[250px] w-[350px] max-w-full rounded-2xl bg-primary/20 md:h-[125px] md:w-[175px] md:rounded-l-3xl">
      <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
    </div>
  )
}
