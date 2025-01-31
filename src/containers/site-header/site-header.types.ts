import { User } from "@/db/schemas"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type SiteSearchUser = {
  id: User["id"]
  displayName: string
  image: string | null
}
