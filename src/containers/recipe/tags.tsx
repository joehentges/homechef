"use client"

import { TagIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RecipeTagsProps {
  tags?: string[]
}

export function RecipeTags(props: RecipeTagsProps) {
  const { tags } = props

  if (!tags || tags.length < 1) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger className="flex flex-row items-center gap-x-1 rounded-3xl px-2 py-1 transition-colors hover:bg-primary/20 md:px-4 md:py-2">
        <TagIcon className="h-4 w-4" />
        <p className="capitalize">{tags[0]}</p>
      </DialogTrigger>
      <DialogContent className="w-auto min-w-[300px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tags</DialogTitle>
          <ul className="space-y-3 py-2 capitalize">
            {tags.map((tag, index) => (
              <li
                key={`${tag}-${index}`}
                className="flex flex-row items-center gap-x-1"
              >
                <TagIcon className="h-4 w-4" />
                {tag}
              </li>
            ))}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
