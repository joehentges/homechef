"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { navigation } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { useScrollBlock } from "@/hooks/useScrollBlock"

import { SiteHeaderMobileNav } from "./site-header-mobile-nav"

export function SiteHeaderNav() {
  const pathname = usePathname()
  const { blockScroll, allowScroll } = useScrollBlock()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  function handleMobileMenuClick() {
    setShowMobileMenu(!showMobileMenu)
    if (showMobileMenu) {
      return allowScroll()
    }
    blockScroll()
  }

  return (
    <div className={cn("flex gap-4 lg:gap-12")}>
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <p className="hidden text-3xl font-bold sm:inline-block">
          <Logo />
        </p>
      </Link>
      <nav className="hidden w-full justify-center gap-4 md:flex lg:gap-12">
        {navigation.siteNav?.map((item, index) => (
          <Link
            key={index}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "flex items-center text-lg font-medium transition-colors hover:text-foreground/70 sm:text-base",
              pathname === item.href && "font-bold",
              item.disabled && "cursor-not-allowed opacity-80"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={handleMobileMenuClick}
      >
        {showMobileMenu ? <XIcon /> : <MenuIcon />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <SiteHeaderMobileNav />}
    </div>
  )
}
