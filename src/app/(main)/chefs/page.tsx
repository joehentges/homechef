import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  SearchParams,
} from "nuqs/server"

import { UsersOrderBy } from "@/types/SearchUsers"
import { getCurrentUser } from "@/lib/session"
import { searchUsersUseCase } from "@/use-cases/users"
import { ChefSearch } from "@/containers/chef-search"

const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  orderBy: parseAsString.withDefault("alphabetically"),
  page: parseAsInteger.withDefault(1),
})

interface ChefsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ChefsPage({ searchParams }: ChefsPageProps) {
  const { search, orderBy, page } = await searchParamsCache.parse(searchParams)

  const user = await getCurrentUser()

  const limit = 10
  const limitLOffset = (page - 1) * limit

  const initialUsers = await searchUsersUseCase({
    search,
    orderBy: orderBy.toLowerCase() as UsersOrderBy,
    limit,
    offset: limitLOffset,
    userId: user?.id,
  })

  return (
    <div className="md:py-10">
      <ChefSearch
        userId={user?.id}
        initialChefs={initialUsers.users}
        initialChefsCount={initialUsers.count}
        chefsPerPageLimit={limit}
      />
    </div>
  )
}
