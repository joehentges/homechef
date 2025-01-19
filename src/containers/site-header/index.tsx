import { UserDetails } from "@/types/UserDetails"
import { Recipe, User } from "@/db/schemas"

import { SiteSearch } from "./search"
import { SiteHeaderAuthNav } from "./site-header-auth-nav"
import { SiteHeaderNav } from "./site-header-nav"
import { SiteHeaderUserAccountNav } from "./site-header-user-account-nav"

interface SiteHeaderProps {
  user?: User
  initialrecipes?: Recipe[]
  initialusers?: UserDetails[]
}

export function SiteHeader(props: SiteHeaderProps) {
  const { user, initialrecipes, initialusers } = props

  return (
    <header className="container z-40">
      <div className="mx-[-32px] flex h-20 items-center justify-between gap-x-6 bg-background px-[32px] py-6 md:bg-transparent">
        <SiteHeaderNav authenticated={!!user} />

        <nav className="flex w-full items-center gap-4 text-nowrap md:w-auto lg:gap-12">
          <SiteSearch
            initialrecipes={initialrecipes}
            initialusers={initialusers}
          />
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
