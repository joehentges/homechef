import { LockIcon, UnlockIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DisplayStatusProps {
  isPrivate: boolean
}

export function DisplayStatus(props: DisplayStatusProps) {
  const { isPrivate } = props

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="hover:text-foreground transition-colors">
          {isPrivate ? (
            <LockIcon className="h-5 w-5" />
          ) : (
            <UnlockIcon className="h-5 w-5" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isPrivate ? "Private recipe" : "Public recipe"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
