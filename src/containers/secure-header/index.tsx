import {
  BellDotIcon,
  ChefHatIcon,
  MessageSquareTextIcon,
  SearchIcon,
} from "lucide-react"

import { secureNav } from "@/config/secure-nav"
import { Logo } from "@/components/logo"

import { SecureHeaderUserDropdown } from "./secure-header-user-dropdown"

interface SecureHeaderProps {
  displayName: string
  email: string
}

export function SecureHeader(props: SecureHeaderProps) {
  const { displayName, email } = props

  return (
    <div className="container flex items-center justify-between py-3">
      <div className="flex flex-row items-center space-x-8">
        <p className="flex items-center gap-x-2 text-2xl font-bold">
          <ChefHatIcon className="h-7 w-7" />
          <Logo />
        </p>
      </div>
      <div className="flex flex-row items-center space-x-10">
        <SearchIcon className="w-5 cursor-pointer" />
        <BellDotIcon className="hover:animate-bell-shake w-5 cursor-pointer" />
        <SecureHeaderUserDropdown
          displayName={displayName}
          email={email}
          navLinks={secureNav.userNav}
        />
      </div>
    </div>
  )
}
