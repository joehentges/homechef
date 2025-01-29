import { User } from "@/db/schemas"

import { ChangeEmail } from "./change-email"
import { ChangePassword } from "./change-password"

interface SettingsProps {
  user: User
}

export function Settings(props: SettingsProps) {
  const { user } = props

  return (
    <div className="bg-primary/20 relative container max-w-[750px] space-y-8 rounded-3xl py-8">
      <p className="text-3xl">Settings</p>
      <ChangeEmail
        currentEmail={user.email}
        emailVerified={user.emailVerified}
      />
      <ChangePassword />
    </div>
  )
}
