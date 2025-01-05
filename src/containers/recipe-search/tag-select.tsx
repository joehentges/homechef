import { Dispatch, SetStateAction } from "react"
import { useQueryState } from "nuqs"

import { MultipleSelector } from "@/components/multiple-selector"

interface TagSelectProps {
  availableTags: { name: string }[]
  onChange: Dispatch<SetStateAction<string[]>>
}

export function TagSelect(props: TagSelectProps) {
  const { availableTags, onChange } = props
  const [tags, setTags] = useQueryState("tags", {
    defaultValue: "",
  })

  function onSelectorChange(
    selectedOptions: {
      value: string
      label: string
    }[]
  ) {
    onChange(selectedOptions.map((option) => option.value))
    setTags(selectedOptions.map((option) => option.value).join(","))
  }

  return (
    <MultipleSelector
      className="rounded-2xl bg-white hover:bg-white dark:bg-black dark:hover:bg-black xl:min-w-[400px]"
      options={availableTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }))}
      onChange={onSelectorChange}
      value={(!!tags ? tags.split(",") : []).map((tag) => ({
        value: tag,
        label: tag,
      }))}
      placeholder="Select tags"
      maxSelected={5}
    />
  )
}
