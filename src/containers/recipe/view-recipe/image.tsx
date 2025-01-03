import Image from "next/image"
import Link from "next/link"
import { CookingPotIcon } from "lucide-react"

import { getDomain } from "@/lib/get-domain"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RecipeImageProps {
  photo?: string | null
}

export function RecipeImage(props: RecipeImageProps) {
  const { photo } = props

  if (photo) {
    return (
      <Dialog>
        <DialogTrigger>
          <div
            className="center h-[250px] w-[300px] max-w-full rounded-2xl bg-cover bg-center bg-no-repeat md:h-[125px] md:w-[150px] md:rounded-l-3xl"
            style={{
              backgroundImage: `url('${photo}')`,
            }}
          />
        </DialogTrigger>
        <DialogContent className="w-auto">
          <DialogTitle className="text-muted-foreground">
            {getDomain(photo)}
          </DialogTitle>
          <img src={photo} alt="highlight" className="rounded-xl" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="center relative h-[250px] w-[350px] max-w-full rounded-2xl bg-primary/20 md:h-[125px] md:w-[175px] md:rounded-l-3xl">
      <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
    </div>
  )
}
