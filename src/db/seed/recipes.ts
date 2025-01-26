import { faker } from "@faker-js/faker"

import { IngredientOrDirection, RecipeWithTags } from "@/types/Recipe"

import { User } from "../schemas"
import { tagsSeed } from "./tags"

function createRandomLengthArray(minLength: number, maxLength: number) {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  return Array.from({ length }, () => Math.random())
}

const recipeDifficulties = [
  "beginner",
  "intermediate",
  "advanced",
  null,
] as const

interface Recipe {
  recipe: Omit<RecipeWithTags, "userId">
  ingredients: IngredientOrDirection[]
  directions: IngredientOrDirection[]
  user: User
}

export const recipesSeed: Recipe[] = createRandomLengthArray(500, 1000).map(
  (_, index) => ({
    recipe: {
      id: index + 1,
      dateCreated: faker.date.past(),
      dateUpdated: faker.date.recent(),
      title: faker.food.dish(),
      description: faker.food.description(),
      prepTime: faker.number.int({ min: 0, max: 60 }),
      cookTime: faker.number.int({ min: 0, max: 600 }),
      difficulty:
        recipeDifficulties[
          Math.floor(Math.random() * recipeDifficulties.length)
        ],
      servings: `${faker.number.int({ min: 1, max: 25 })} servings`,
      photo: faker.image.url(),
      private: false,
      tags: tagsSeed
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.random() * 5),
    },
    ingredients: createRandomLengthArray(2, 10).map((_, index) => ({
      orderNumber: index,
      description: faker.food.ingredient(),
    })),
    directions: createRandomLengthArray(1, 10).map((_, index) => ({
      orderNumber: index,
      description: faker.food.adjective(),
    })),
    user: {
      id: faker.number.int({ min: 1, max: 50 }),
      dateCreated: new Date(),
      dateUpdated: new Date(),
      email: "temp@email.com",
      emailVerified: null,
      password: null,
      displayName: "no name",
      image: null,
      summary: null,
      featuredRecipeId: null,
    },
  })
)
