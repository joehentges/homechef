import { getAvailableRecipeTagsUseCase } from "@/use-cases/recipes"
import { RecipeSearch } from "@/containers/recipe-search"

export default async function RecipesPage() {
  const availableTags = await getAvailableRecipeTagsUseCase()

  return (
    <div>
      <RecipeSearch availableTags={availableTags} />
    </div>
  )
}
