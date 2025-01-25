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
      <DialogTrigger className="hover:bg-primary/20 flex flex-row items-center gap-x-1 rounded-3xl px-2 py-1 transition-colors md:px-4 md:py-2">
        <TagIcon className="h-[16px] w-[16px]" />
        <p className="md:text-start">{tags[0]}</p>
      </DialogTrigger>
      <DialogContent className="w-auto min-w-[200px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tags</DialogTitle>
          <ul className="space-y-3 py-2 text-start">
            {tags.map((tag, index) => (
              <li key={`${tag}-${index}`}>{tag}</li>
            ))}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
