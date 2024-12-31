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
        href={`/sign-in?from=${fromPath}`}
        className="flex items-center text-lg font-medium transition-colors hover:text-foreground/70 sm:text-base"
      >
        Sign In
      </Link>
      <Link
        href={`/sign-up?from=${fromPath}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden whitespace-nowrap rounded-3xl px-4 text-base sm:inline-flex"
        )}
      >
        Get started
      </Link>
    </>
  )
}
