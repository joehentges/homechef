import { assertAuthenticated } from "@/lib/session"
import { Settings } from "@/containers/settings"

export default async function SettingsPage() {
  const user = await assertAuthenticated()

  return (
    <div className="md:pt-8">
      <Settings user={user} />
    </div>
  )
}
