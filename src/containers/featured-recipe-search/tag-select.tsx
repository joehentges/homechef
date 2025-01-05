import {
  AppleIcon,
  BananaIcon,
  BeefIcon,
  CakeSliceIcon,
  CookieIcon,
  FishIcon,
  IceCreamConeIcon,
  MartiniIcon,
  PizzaIcon,
  SaladIcon,
  SandwichIcon,
  SoupIcon,
  TagIcon,
} from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"

const Icons = {
  default: TagIcon,
  //
  apple: AppleIcon,
  banana: BananaIcon,
  beef: BeefIcon,
  cake: CakeSliceIcon,
  desert: CakeSliceIcon,
  drink: MartiniIcon,
  fish: FishIcon,
  "ice-cream": IceCreamConeIcon,
  pizza: PizzaIcon,
  salad: SaladIcon,
  sandwich: SandwichIcon,
  soup: SoupIcon,
  cookie: CookieIcon,
} as const

type Icon = keyof typeof Icons

interface TagSelectProps {
  tags: string[]
}

export function TagSelect(props: TagSelectProps) {
  const { tags } = props
  const [selectedTag, setTag] = useQueryState("tag", { defaultValue: "" })

  function onTagSelected(tag: string) {
    if (tag === selectedTag) {
      return setTag("")
    }
    setTag(tag)
  }

  return (
    <div className="flex min-w-[150px] flex-row flex-wrap justify-center gap-2 md:min-w-[200px] md:flex-col md:gap-y-4">
      {tags.length < 1 && (
        <p className="text-lg text-muted-foreground">No tags available</p>
      )}
      {tags.map((tag) => {
        const IconElement = Icons[tag as Icon] ?? Icons.default
        const selected = tag === selectedTag
        return (
          <button
            key={tag}
            className={cn(
              "flex w-[150px] items-center gap-x-2 rounded-3xl border px-3 py-2 capitalize transition-colors hover:bg-primary/30 md:w-[200px]",
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
              <IconElement className="h-5 w-5" />
            </span>
            {tag}
          </button>
        )
      })}
    </div>
  )
}
