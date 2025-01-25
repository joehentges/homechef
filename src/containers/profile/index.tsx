"use client"

import { useState } from "react"

import { Recipe, User } from "@/db/schemas"

import { EditProfile } from "./edit-profile"
import { ViewProfile } from "./view-profile"

interface ProfileProps {
  user: User
  canEdit?: boolean
  featuredRecipe?: Recipe
  latestRecipes: Recipe[]
}

export function Profile(props: ProfileProps) {
  const { user, canEdit, featuredRecipe, latestRecipes } = props

  const [editViewEnabled, setEditViewEnabled] = useState<boolean>(false)

  if (editViewEnabled) {
    return <EditProfile onBackButtonClicked={() => setEditViewEnabled(false)} />
  }

  return (
    <ViewProfile
      user={user}
      canEdit={canEdit}
      enableEditView={() => setEditViewEnabled(true)}
      featuredRecipe={featuredRecipe}
      latestRecipes={latestRecipes}
    />
  )
}
