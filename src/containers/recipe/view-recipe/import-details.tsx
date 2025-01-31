import Link from "next/link"

import { User } from "@/db/schemas"
import { getDomain } from "@/lib/get-domain"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImportDetailsProps {
  importedBy?: {
    id: User["id"]
    displayName: User["displayName"]
  } | null
  url: string
}

export function ImportDetails(props: ImportDetailsProps) {
  const { importedBy, url } = props

  if (importedBy) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger className="transition-colors hover:text-foreground">
            <Link
              href={url}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <p>From: {getDomain(url)}</p>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Imported by:{" "}
              <Link
                href={`/chefs/${importedBy.id}`}
                className="transition-colors hover:text-muted-foreground"
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
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      <p>From: {getDomain(url)}</p>
    </Link>
  )
}
