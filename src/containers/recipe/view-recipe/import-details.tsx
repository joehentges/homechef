import Link from "next/link"

import { getDomain } from "@/lib/get-domain"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImportDetailsProps {
  importedBy?: {
    id: number
    displayName: string
  } | null
  url: string
}

export function ImportDetails(props: ImportDetailsProps) {
  const { importedBy, url } = props

  if (importedBy) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger className="hover:text-foreground transition-colors">
            <Link
              href={url}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <p>From: {getDomain(url)}</p>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Imported by:{" "}
              <Link
                href={`/chefs/${importedBy.id}`}
                className="hover:text-muted-foreground transition-colors"
              >
                {importedBy.displayName}
              </Link>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Link
      href={url}
      target="_blank"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <p>From: {getDomain(url)}</p>
    </Link>
  )
}
