import { MultipleSelector } from "@/components/multiple-selector"

interface TagSelectProps {
  availableTags: { name: string }[]
  tags: string[]
  setTags: (value: string[]) => void
}

export function TagSelect(props: TagSelectProps) {
  const { availableTags, tags, setTags } = props

  return (
    <MultipleSelector
      className="rounded-3xl bg-white hover:bg-white dark:bg-black dark:hover:bg-black xl:min-w-[400px]"
      options={availableTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }))}
      onChange={(selectedOptions) =>
        setTags(selectedOptions.map((option) => option.value))
      }
      value={tags.map((tag) => ({
        value: tag,
        label: tag,
      }))}
      placeholder="Select tags"
      maxSelected={5}
    />
  )
}
