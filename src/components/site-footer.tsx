import * as React from "react"
import Link from "next/link"

import { navigation } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-5 text-sm md:flex-row md:py-3">
        <p className="leading-loose md:text-left">
          © {new Date().getFullYear()} {siteConfig.name} v0.1.0
        </p>
        <div className="flex flex-col md:flex-row">
          {navigation.siteFooter.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="duration-100 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
