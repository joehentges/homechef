"use client"

import * as React from "react"
import Link from "next/link"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { navigation } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const { theme, setTheme } = useTheme()

  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm md:flex-row md:py-5">
        <p className="leading-loose md:text-left">
          {new Date().getFullYear()} {siteConfig.name} {siteConfig.version}
        </p>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {navigation.siteFooter.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="duration-100 hover:underline"
            >
              {item.label}
            </Link>
          ))}

          <Button
            className="rounded-full"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </footer>
  )
}
