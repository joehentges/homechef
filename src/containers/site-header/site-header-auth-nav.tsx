"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useFromPath } from "@/hooks/use-from-path"

export function SiteHeaderAuthNav() {
  const fromPath = useFromPath()

  return (
    <>
      <Link
        href={`/sign-in?from=${encodeURIComponent(fromPath)}`}
        className="hover:text-foreground/70 flex items-center text-lg font-medium transition-colors sm:text-base"
      >
        Sign In
      </Link>
      <Link
        href={`/sign-up?from=${fromPath}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden rounded-3xl px-4 text-base whitespace-nowrap sm:inline-flex"
        )}
      >
        Get started
      </Link>
    </>
  )
}
