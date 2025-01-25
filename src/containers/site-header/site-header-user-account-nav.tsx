"use client"

import Link from "next/link"
import { ChefHatIcon } from "lucide-react"

import { navigation } from "@/config/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

import { signOutAction } from "./actions"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  displayName: string
  email: string
  image: string | null
}

export function SiteHeaderUserAccountNav(props: UserAccountNavProps) {
  const { displayName, email, image } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <ChefHatIcon className="fill-background absolute -top-[0.85em] left-[1em] z-10 h-6 w-6 rotate-[30deg] dark:text-white" />
          <UserAvatar
            displayName={displayName}
            image={image}
            className="h-8 w-8 border-2 border-slate-800"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-1 flex flex-col px-4 py-2" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{displayName}</p>
            <p className="text-muted-foreground w-[200px] truncate text-sm">
              {email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />
        {navigation.userNav.map((item) => (
          <DropdownMenuItem
            key={item.label}
            asChild
            className="cursor-pointer py-2"
          >
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer py-2 text-red-500"
          onSelect={(event) => {
            event.preventDefault()
            signOutAction()
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
