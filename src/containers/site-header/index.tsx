import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { User } from "@/db/schemas"

import { SiteHeaderAuthNav } from "./site-header-auth-nav"
import { SiteHeaderNav } from "./site-header-nav"
import { SiteHeaderUserAccountNav } from "./site-header-user-account-nav"

interface SiteHeaderProps {
  user?: User
}

export function SiteHeader(props: SiteHeaderProps) {
  const { user } = props

  return (
    <header className="container z-40">
      <div className="mx-[-32px] flex h-20 items-center justify-between bg-white px-[32px] py-6 md:bg-transparent">
        <SiteHeaderNav />
        <nav className="flex gap-4 lg:gap-8">
          <Link
            href="/search"
            className="hidden items-center text-lg font-medium transition-colors hover:text-foreground/70 sm:text-base md:flex"
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Link>
          {user ? (
            <SiteHeaderUserAccountNav
              displayName={user.displayName}
              image={undefined} // user.image
              email={user.email}
            />
          ) : (
            <SiteHeaderAuthNav />
          )}
        </nav>
      </div>
    </header>
  )
}
