interface RecipeSeed {
  id: number
  created_by: number
  title: string
  description: string
  prepTime?: number
  cookTime: number
  difficulty: "easy" | "medium" | "hard"
  servings: number
  servingsUnit?: string
  image?: string
}

export const recipesSeed: RecipeSeed[] = [
  {
    id: 1,
    created_by: 1,
    title: "Recipe 1",
    description: "This is the first recipe",
    cookTime: 20,
    difficulty: "easy",
    servings: 2,
  },
  {
    id: 2,
    created_by: 1,
    title: "Recipe 2",
    description: "This is the second recipe",
    prepTime: 10,
    cookTime: 30,
    difficulty: "medium",
    servings: 1,
    servingsUnit: "cake",
    image:
      "https://www.piesandtacos.com/wp-content/uploads/2024/04/chocolate-birthday-cake-scaled.jpg",
  },
]
