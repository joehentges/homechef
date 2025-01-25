import { CookingPotIcon } from "lucide-react"

import { getDomain } from "@/lib/get-domain"
import {
  Dialog,
  DialogContent,
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
            className="group h-[250px] w-[300px] max-w-full rounded-2xl bg-cover bg-center bg-no-repeat md:h-[125px] md:w-[150px] md:rounded-l-3xl"
            style={{
              backgroundImage: `url('${photo}')`,
            }}
          >
            <div className="bg-primary/10 h-full w-full rounded-l-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
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
    <div className="bg-primary/20 relative h-[250px] w-[350px] max-w-full rounded-2xl md:h-[125px] md:w-[185px] md:rounded-l-3xl">
      <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
    </div>
  )
}
