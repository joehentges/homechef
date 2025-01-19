"use client"

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
  currentPage: number
  onPageClicked: (page: number) => void
}

export function CatalogPagination(props: CatalogPaginationProps) {
  const { pageCount, currentPage, onPageClicked } = props

  return (
    <Pagination>
      <PaginationContent className="cursor-pointer select-none">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageClicked(currentPage - 1)}
              className="rounded-2xl"
            />
          </PaginationItem>
        )}

        {currentPage - 1 === pageCount - 1 ? (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageClicked(currentPage - 1)}
              className="rounded-2xl"
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              href="#"
              className="pointer-events-none rounded-2xl bg-white dark:bg-black"
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage !== pageCount ? (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageClicked(currentPage + 1)}
              className="rounded-2xl"
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink className="pointer-events-none rounded-2xl bg-white dark:bg-black">
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage + 1 < pageCount && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < pageCount && (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageClicked(currentPage + 1)}
              className="rounded-2xl"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
