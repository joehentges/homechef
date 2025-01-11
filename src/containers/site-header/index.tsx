import { Recipe, User } from "@/db/schemas"

import { Search } from "./search"
import { SiteHeaderAuthNav } from "./site-header-auth-nav"
import { SiteHeaderNav } from "./site-header-nav"
import { SiteHeaderUserAccountNav } from "./site-header-user-account-nav"

interface SiteHeaderProps {
  user?: User
  initialSearchRecipes?: Recipe[]
  initialSearchUsers?: Omit<User, "password">[]
}

export function SiteHeader(props: SiteHeaderProps) {
  const { user, initialSearchRecipes, initialSearchUsers } = props

  return (
    <header className="container z-40">
      <div className="mx-[-32px] flex h-20 items-center justify-between gap-x-6 bg-background px-[32px] py-6 md:bg-transparent">
        <SiteHeaderNav authenticated={!!user} />

        <nav className="flex gap-4 lg:gap-12">
          <div className="w-full">
            <Search
              initialSearchRecipes={initialSearchRecipes?.slice(0, 5)}
              initialSearchUsers={initialSearchUsers?.slice(0, 5)}
            />
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
