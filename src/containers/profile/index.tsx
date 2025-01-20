"use client"

import { useState } from "react"

import { User } from "@/db/schemas"

import { EditProfile } from "./edit-profile"
import { ViewProfile } from "./view-profile"

interface ProfileProps {
  user: User
  canEdit?: boolean
}

export function Profile(props: ProfileProps) {
  const { user, canEdit } = props

  const [editViewEnabled, setEditViewEnabled] = useState<boolean>(false)

  if (editViewEnabled) {
    return <EditProfile onBackButtonClicked={() => setEditViewEnabled(false)} />
  }

  return (
    <ViewProfile
      user={user}
      canEdit={canEdit}
      enableEditView={() => setEditViewEnabled(true)}
    />
  )
}
