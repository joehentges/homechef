"use client"

import { usePathname, useSearchParams } from "next/navigation"

export function useFromPath() {
  const pathname = usePathname()
  const params = useSearchParams()

  return `${pathname}${params ? `?${params.toString()}` : ""}`
}
