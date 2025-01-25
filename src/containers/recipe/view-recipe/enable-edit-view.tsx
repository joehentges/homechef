"use client"

import Link from "next/link"
import { PencilIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFromPath } from "@/hooks/use-from-path"

interface EnableEditViewProps {
  isAuthenticated?: boolean
  enableEditView: () => void
}

export function EnableEditView(props: EnableEditViewProps) {
  const { isAuthenticated, enableEditView } = props

  const fromPath = useFromPath()

  if (isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger
            onClick={enableEditView}
            className="hover:text-foreground transition-colors"
          >
            <PencilIcon className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit the recipe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <Link
            href={`/sign-in?from=${encodeURIComponent(fromPath)}`}
            className="hover:text-foreground transition-colors"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign in to edit the recipe</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
