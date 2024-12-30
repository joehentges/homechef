import { importRecipe } from "@/lib/import-recipe"
import { RecipeContainer } from "@/containers/recipe"

interface ImportRecipePageProps {
  searchParams: Promise<{
    url: string
  }>
}

export default async function ImportRecipePage(props: ImportRecipePageProps) {
  const { searchParams } = props
  const { url } = await searchParams

  if (!url) {
    throw new Error("Url not found")
  }

  // check Database to see if recipe has already been imported
  // skip next part if it has

  const recipeData = await importRecipe(url)

  if (!recipeData) {
    throw new Error("Recipe not found")
  }

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer recipe={recipeData} />
    </div>
  )
}
