"use client"

import { usePathname, useSearchParams } from "next/navigation"

export function getFromPath() {
  const pathname = usePathname()
  const params = useSearchParams()

  return `${pathname}${params ? `?${params.toString()}` : ""}`
}
