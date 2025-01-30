"use client"

import { PencilIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EnableEditViewProps {
  enableEditView: () => void
}

export function EnableEditView(props: EnableEditViewProps) {
  const { enableEditView } = props

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          onClick={enableEditView}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <PencilIcon className="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit your profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
