import { User } from "@/db/schemas"
import { getAvatarImageUrl } from "@/lib/get-avatar-image-url"

import { EnableEditView } from "./enable-edit-view"

interface ViewProfileProps {
  user: User
  canEdit?: boolean
  enableEditView: () => void
}

export function ViewProfile(props: ViewProfileProps) {
  const { user, canEdit, enableEditView } = props

  return (
    <div className="container relative max-w-[1000px] rounded-3xl bg-primary/20 py-8">
      {canEdit && (
        <div className="absolute right-10 hidden md:block">
          <EnableEditView enableEditView={enableEditView} />
        </div>
      )}

      <div className="flex flex-col items-center gap-x-4 md:flex-row">
        <div
          className="max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] rounded-2xl border-4 bg-primary bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${user.image ? user.image : getAvatarImageUrl(user.displayName)}')`,
          }}
        />
        {canEdit && (
          <div className="block pt-4 md:hidden">
            <EnableEditView enableEditView={enableEditView} />
          </div>
        )}
        <div className="flex w-full flex-col gap-y-2 py-4">
          <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
            {user.displayName}
          </p>
          <p className="hidden md:block">{user.summary}</p>
        </div>
      </div>
      <p className="block text-center md:hidden">{user.summary}</p>
    </div>
  )
}
