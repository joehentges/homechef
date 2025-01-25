"use client"

import { useState } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"
import { useServerAction } from "zsa-react"

import { PrimaryKey } from "@/types"
import { UsersOrderBy } from "@/types/SearchUsers"
import { UserDetails } from "@/types/UserDetails"
import { CatalogPagination } from "@/components/catalog-pagination"
import { ChefCatalog } from "@/components/chef-catalog"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"

import { searchChefsAction } from "./actions"
import { Input } from "./input"
import { OrderBySelect } from "./order-by-select"

interface ChefSearchProps {
  userId?: PrimaryKey
  initialChefs: UserDetails[]
  initialChefsCount: number
  chefsPerPageLimit: number
}

export function ChefSearch(props: ChefSearchProps) {
  const { userId, initialChefs, initialChefsCount, chefsPerPageLimit } = props
  const { toast } = useToast()

  const [chefsResult, setChefsResult] = useState<UserDetails[]>(initialChefs)
  const [chefsCount, setChefsCount] = useState<number>(initialChefsCount)
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(initialChefsCount / chefsPerPageLimit)
  )

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [orderBy, setOrderBy] = useQueryState<UsersOrderBy>(
    "orderBy",
    parseAsStringEnum([
      "alphabetically",
      "importedcount",
      "createdcount",
    ]).withDefault("alphabetically")
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const { execute } = useServerAction(searchChefsAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      setChefsResult(data.users)
      setChefsCount(data.count)
      setPageCount(Math.ceil(data.count / chefsPerPageLimit))
    },
  })

  const { execute: executePageChange } = useServerAction(searchChefsAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      setPage(data.page)
      setChefsResult(data.users)
      setChefsCount(data.count)
      setPageCount(Math.ceil(data.count / chefsPerPageLimit))
    },
  })

  const debouncedSearch = useDebounce((search) => {
    execute({
      search,
      orderBy,
      chefsPerPageLimit,
      page,
      userId,
    })
  }, 500)

  function onSearchChange(value: string) {
    setSearch(value)
    debouncedSearch(value)
  }

  function onSortByChange(newSortBy: UsersOrderBy) {
    setOrderBy(newSortBy)
    execute({
      search,
      orderBy: newSortBy,
      chefsPerPageLimit,
      page,
      userId,
    })
  }

  function onPageChange(page: number) {
    executePageChange({
      search,
      orderBy,
      chefsPerPageLimit,
      page,
      userId,
    })
  }

  return (
    <div className="bg-primary/20 container space-y-4 rounded-3xl py-8 md:space-y-8">
      <p className="text-4xl font-bold">
        Chef Search <span className="text-2xl">({chefsCount})</span>
      </p>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Input search={search} onChange={onSearchChange} />
        <OrderBySelect orderBy={orderBy} onChange={onSortByChange} />
      </div>
      <ChefCatalog chefs={chefsResult} />
      {pageCount > 1 && (
        <div className="py-4">
          <CatalogPagination
            pageCount={pageCount}
            currentPage={page}
            onPageClicked={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
