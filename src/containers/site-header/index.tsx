import { User } from "@/db/schemas"

import { SiteHeaderAuthNav } from "./site-header-auth-nav"
import { SiteHeaderNav } from "./site-header-nav"
import { SiteHeaderUserAccountNav } from "./site-header-user-account-nav"
import { WebsiteSearch } from "./website-search"

interface SiteHeaderProps {
  user?: User
}

export function SiteHeader(props: SiteHeaderProps) {
  const { user } = props

  return (
    <header className="container z-40">
      <div className="mx-[-32px] flex h-20 items-center justify-between gap-x-6 bg-background px-[32px] py-6 md:bg-transparent">
        <SiteHeaderNav authenticated={!!user} />

        <div className="block w-full md:hidden">
          <WebsiteSearch />
        </div>
        <nav className="flex gap-4 lg:gap-8">
          <div className="hidden md:block">
            <WebsiteSearch />
          </div>
          {user ? (
            <SiteHeaderUserAccountNav
              displayName={user.displayName}
              image={user.image}
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
