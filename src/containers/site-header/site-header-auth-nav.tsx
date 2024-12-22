"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeaderAuthNav() {
  const pathname = usePathname()

  return (
    <>
      <Link
        href={`/sign-in?from=${pathname}`}
        className="flex items-center text-lg font-medium transition-colors hover:text-foreground/70 sm:text-base"
      >
        Sign In
      </Link>
      <Link
        href={`/sign-up?from=${pathname}`}
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
