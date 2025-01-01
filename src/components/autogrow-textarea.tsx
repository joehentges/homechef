"use client"

import { ChangeEvent, useMemo, useRef } from "react"

import { Textarea } from "@/components/ui/textarea"

interface AutogrowTextareaProps extends React.ComponentProps<"textarea"> {
  maxRows?: number
}

export function AutogrowTextarea(props: AutogrowTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxRows = props.maxRows

  function calculateRows(ref: HTMLTextAreaElement) {
    const textarea = ref
    textarea.style.height = "auto"
    console.log(textarea.value)

    const style = window.getComputedStyle(textarea)
    const borderHeight =
      parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth)
    const paddingHeight =
      parseInt(style.paddingTop) + parseInt(style.paddingBottom)

    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Infinity

    return Math.min(textarea.scrollHeight + borderHeight, maxHeight)
  }

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }

    const textarea = e.target
    const newHeight = calculateRows(textarea)

    textarea.style.height = `${newHeight}px`
  }

  const defaultRows = 1

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      onChange={handleInput}
      rows={defaultRows}
      className="min-h-[none] resize-none"
    />
  )
}
