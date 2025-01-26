import { TagIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface TagSelectProps {
  selectedTag: string
  setSelectedTag: (value: string) => void
  tags: string[]
}

export function TagSelect(props: TagSelectProps) {
  const { selectedTag, setSelectedTag, tags } = props

  function onTagSelected(tag: string) {
    if (tag === selectedTag) {
      return setSelectedTag("")
    }
    setSelectedTag(tag)
  }

  return (
    <div className="flex min-w-[150px] flex-row flex-wrap justify-center gap-2 md:min-w-[200px] md:flex-col md:gap-y-4">
      {tags.length < 1 && (
        <p className="text-muted-foreground text-lg">No tags available</p>
      )}
      {tags.map((tag) => {
        const selected = tag === selectedTag
        return (
          <button
            key={tag}
            className={cn(
              "hover:bg-primary/30 flex w-[150px] items-center gap-x-2 rounded-3xl border px-3 py-2 capitalize transition-colors md:w-[200px]",
              selected && "bg-primary/80 hover:bg-primary/60 dark:bg-primary/20"
            )}
            onClick={() => onTagSelected(tag)}
          >
            <span
              className={cn(
                "rounded-full p-[0.25rem]",
                selected && "bg-background"
              )}
            >
              <TagIcon className="h-5 w-5" />
            </span>
            {tag}
          </button>
        )
      })}
    </div>
  )
}
