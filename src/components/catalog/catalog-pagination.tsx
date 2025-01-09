"use client"

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CatalogPaginationProps {
  pageCount: number
  paginationAnchor?: string
}

export function CatalogPagination(props: CatalogPaginationProps) {
  const { pageCount, paginationAnchor = "" } = props

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: { defaultValue: "Newest", parse: (value) => value || "Newest" },
    tag: { defaultValue: "", parse: (value) => value || "" },
    page: { defaultValue: 1, parse: (value) => parseInt(value) || 1 },
  })

  const searchParams = {
    search: parseAsString,
    sortBy: parseAsString,
    tag: parseAsString,
    page: parseAsInteger,
  }

  const serialize = createSerializer(searchParams)

  return (
    <Pagination>
      <PaginationContent>
        {searchValues.page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={
                serialize({ ...searchValues, page: searchValues.page - 1 }) +
                paginationAnchor
              }
            />
          </PaginationItem>
        )}

        {searchValues.page - 1 === pageCount - 1 ? (
          <PaginationItem>
            <PaginationLink
              href={
                serialize({ ...searchValues, page: searchValues.page - 1 }) +
                paginationAnchor
              }
              className="rounded-2xl"
            >
              {searchValues.page - 1}
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              href="#"
              className="pointer-events-none rounded-2xl bg-white dark:bg-black"
            >
              {searchValues.page}
            </PaginationLink>
          </PaginationItem>
        )}
        {searchValues.page !== pageCount ? (
          <PaginationItem>
            <PaginationLink
              href={
                serialize({ ...searchValues, page: searchValues.page + 1 }) +
                paginationAnchor
              }
              className="rounded-2xl"
            >
              {searchValues.page + 1}
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink className="pointer-events-none rounded-2xl bg-white dark:bg-black">
              {searchValues.page}
            </PaginationLink>
          </PaginationItem>
        )}

        {searchValues.page + 1 < pageCount && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {searchValues.page < pageCount && (
          <PaginationItem>
            <PaginationNext
              href={
                serialize({ ...searchValues, page: searchValues.page + 1 }) +
                paginationAnchor
              }
              className="rounded-2xl"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
