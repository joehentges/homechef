import { importRecipe } from "@/lib/import-recipe"
import { Recipe } from "@/containers/recipe"

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

  const recipeData = await importRecipe(url)

  if (!recipeData) {
    throw new Error("Recipe not found")
  }

  return (
    <div className="py-8">
      <Recipe recipe={recipeData} />
    </div>
  )
}
