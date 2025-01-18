import { PrimaryKey } from "@/types"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type SiteSearchUser = {
  id: PrimaryKey
  displayName: string
  image: string | null
}
