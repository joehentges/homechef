import { Dispatch, SetStateAction, useState } from "react"
import { CookingPotIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface EditImageProps {
  photo?: string | null
  setPhoto: Dispatch<SetStateAction<string | undefined | null>>
}

export function EditImage(props: EditImageProps) {
  const { photo, setPhoto } = props

  const [photoPathInput, setPhotoPathInput] = useState(photo)
  const [pathPathError, setPhotoPathInputError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  function isValidImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(url)
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          resolve(false)
          return
        }
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = parsedUrl.href
      } catch {
        resolve(false)
      }
    })
  }

  async function onPhotoSet() {
    const validPhotoCheck = await isValidImageUrl(photoPathInput ?? "")
    if (validPhotoCheck) {
      setPhotoPathInputError(false)
      setPhoto(photoPathInput)
      setDialogOpen(false)
    } else {
      setPhotoPathInputError(true)
    }
  }

  function onClearPhoto() {
    setPhotoPathInput(null)
    setPhotoPathInputError(false)
    setPhoto(null)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        {photo ? (
          <div
            className="group h-[250px] w-[300px] max-w-full rounded-2xl bg-cover bg-center bg-no-repeat md:h-[125px] md:w-[150px] md:rounded-l-3xl"
            style={{
              backgroundImage: `url('${photo}')`,
            }}
          >
            <div className="bg-primary/10 h-full w-full rounded-l-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ) : (
          <div className="bg-primary/20 hover:bg-primary/10 relative h-[250px] w-[350px] max-w-full rounded-2xl transition-colors md:h-[125px] md:w-[150px] md:rounded-l-3xl">
            <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="w-auto">
        <DialogTitle>Change photo</DialogTitle>
        {photo ? (
          <div
            className="group h-[250px] w-[300px] rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${photo}')`,
            }}
          />
        ) : (
          <div className="bg-primary/20 relative h-[250px] w-[300px] rounded-2xl">
            <CookingPotIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform" />
          </div>
        )}
        <div className="space-y-2">
          <Input
            id="set-photo-path"
            placeholder="https://photo.com/path"
            type="text"
            value={photoPathInput ?? ""}
            onChange={(e) => setPhotoPathInput(e.target.value)}
          />
          {pathPathError && (
            <p className="text-destructive text-xs">Photo url must be valid</p>
          )}
          <DialogFooter className="space-x-2">
            <Button onClick={onPhotoSet}>Set photo</Button>
            <Button onClick={onClearPhoto}>Clear photo</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
