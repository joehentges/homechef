import { Dispatch, SetStateAction, useState } from "react"
import { CookingPotIcon } from "lucide-react"

import { getAvatarImageUrl } from "@/lib/get-avatar-image-url"
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
  displayName: string
  image?: string | null
  setImage: Dispatch<SetStateAction<string | undefined | null>>
}

export function EditImage(props: EditImageProps) {
  const { displayName, image, setImage } = props

  const [imagePathInput, setImagePathInput] = useState(image)
  const [pathPathError, setImagePathInputError] = useState(false)
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

  async function onImageSet() {
    const validImageCheck = await isValidImageUrl(imagePathInput ?? "")
    if (validImageCheck) {
      setImagePathInputError(false)
      setImage(imagePathInput)
      setDialogOpen(false)
    } else {
      setImagePathInputError(true)
    }
  }

  function onClearImage() {
    setImagePathInput(null)
    setImagePathInputError(false)
    setImage(null)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div
          className="group h-[200px] max-h-[200px] min-h-[200px] w-[200px] min-w-[200px] max-w-[200px] rounded-2xl border-4 bg-primary bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${image ? image : getAvatarImageUrl(displayName)}')`,
          }}
        >
          <div className="h-full w-full rounded-2xl bg-primary/20 opacity-0 transition-opacity hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-auto">
        <DialogTitle>Change image</DialogTitle>
        {image ? (
          <div
            className="group h-[250px] w-[300px] rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ) : (
          <div className="relative h-[250px] w-[300px] rounded-2xl bg-primary/20">
            <CookingPotIcon className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        )}
        <div className="space-y-2">
          <Input
            id="set-image-path"
            placeholder="https://image.com/path"
            type="text"
            value={imagePathInput ?? ""}
            onChange={(e) => setImagePathInput(e.target.value)}
          />
          {pathPathError && (
            <p className="text-xs text-destructive">Image url must be valid</p>
          )}
          <DialogFooter className="space-x-2">
            <Button onClick={onImageSet}>Set image</Button>
            <Button onClick={onClearImage}>Clear image</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
