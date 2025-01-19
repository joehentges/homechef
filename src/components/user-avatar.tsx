import { AvatarProps } from "@radix-ui/react-avatar"
import { UserIcon } from "lucide-react"

import { getAvatarImageUrl } from "@/lib/get-avatar-image-url"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  displayName: string
  image: string | null
  className?: string
}

export function UserAvatar({
  displayName,
  image,
  className,
  ...props
}: UserAvatarProps) {
  return (
    <Avatar {...props} className={cn(className, "bg-primary")}>
      {image ? (
        <AvatarImage alt="Avatar" src={image} />
      ) : (
        <AvatarImage alt="Avatar" src={getAvatarImageUrl(displayName)} />
      )}
      <AvatarFallback className="bg-primary">
        <span className="sr-only">{displayName}</span>
        <UserIcon className="h-4 w-4 dark:text-black" />
      </AvatarFallback>
    </Avatar>
  )
}
