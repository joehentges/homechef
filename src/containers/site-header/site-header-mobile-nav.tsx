import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { navigation } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

export function SiteHeaderMobileNav() {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto pb-32 shadow-md md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-2 border-b bg-popover px-9 py-4 text-popover-foreground shadow-md">
        <Link href="/">
          <p className="text-2xl font-bold">
            <Logo />
          </p>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {navigation.siteNav.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                pathname === item.href && "font-bold",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/recipes"
            className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
          >
            Search
          </Link>
        </nav>
      </div>
    </div>
  )
}
