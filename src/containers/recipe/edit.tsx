"use client"

import { RecipeDetails } from "@/types/Recipe"

interface RecipeEditViewProps {
  currentRecipe: RecipeDetails
  setCurrentRecipe: (recipe: RecipeDetails) => void
}

export function RecipeEditView(props: RecipeEditViewProps) {
  const { currentRecipe, setCurrentRecipe } = props

  return (
    <div className="container max-w-[850px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
      <p>hi</p>
    </div>
  )
}
