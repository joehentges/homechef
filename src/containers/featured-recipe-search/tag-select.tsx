import {
  CakeSliceIcon,
  MartiniIcon,
  SaladIcon,
  SandwichIcon,
  SoupIcon,
} from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"

const Icons = {
  desert: CakeSliceIcon,
  drink: MartiniIcon,
  salad: SaladIcon,
  sandwich: SandwichIcon,
  soup: SoupIcon,
} as const

type Icon = keyof typeof Icons

export type Tag = {
  label: string
  icon: Icon
}

interface TagSelectProps {
  tags: Tag[]
}

export function TagSelect(props: TagSelectProps) {
  const { tags } = props
  const [selectedTag, setTag] = useQueryState("tag", { defaultValue: "" })

  function onTagSelected(tag: Tag) {
    if (tag.label === selectedTag) {
      return setTag("")
    }
    setTag(tag.label)
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-2 md:flex-col md:gap-y-4">
      {tags.map((tag) => {
        const IconElement = Icons[tag.icon]
        const selected = tag.label === selectedTag
        return (
          <button
            key={tag.label}
            className={cn(
              "flex w-[150px] items-center gap-x-2 rounded-3xl border px-3 py-2 md:w-[200px]",
              selected && "bg-primary/80 dark:bg-primary/60"
            )}
            onClick={() => onTagSelected(tag)}
          >
            <span
              className={cn(
                "rounded-full p-[0.25rem]",
                selected && "bg-background"
              )}
            >
              <IconElement className="h-5 w-5" />
            </span>
            {tag.label}
          </button>
        )
      })}
    </div>
  )
}
