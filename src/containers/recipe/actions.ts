"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { rateLimitByKey } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import { addRecipeUseCase, updateRecipeUseCase } from "@/use-cases/recipes"

const recipeActionSchema = z.object({
  recipe: z.object({
    id: z.number().optional(),
    title: z.string().min(2),
    description: z.string(),
    servings: z.string().min(1),
    prepTime: z.coerce.number().min(0),
    cookTime: z.coerce.number().min(0),
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .nullable()
      .optional(),
    private: z.boolean().default(false),
    photo: z.string().min(1).optional(),
  }),
  ingredients: z.array(
    z.object({
      orderNumber: z.coerce.number(),
      description: z.string().min(3),
    })
  ),
  directions: z.array(
    z.object({
      orderNumber: z.coerce.number(),
      description: z.string().min(3),
    })
  ),
  tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
})

export const addRecipeAction = authenticatedAction
  .createServerAction()
  .input(recipeActionSchema)
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `edit-recipe-author-${user.id}`,
      limit: 3,
      window: 10000,
    })
    const recipe = await addRecipeUseCase(
      {
        recipe: {
          ...input.recipe,
        },
        ingredients: input.ingredients,
        directions: input.directions,
        tags: input.tags.map((tag) => tag.value),
      },
      user
    )

    redirect(`/recipes/${recipe.recipe.id}`)
  })

export const updateRecipeAction = authenticatedAction
  .createServerAction()
  .input(recipeActionSchema)
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `edit-recipe-author-${user.id}`,
      limit: 3,
      window: 10000,
    })
    if (!input.recipe.id) {
      throw new Error("Recipe not found")
    }
    const recipe = await updateRecipeUseCase(
      {
        recipe: {
          ...input.recipe,
        },
        ingredients: input.ingredients,
        directions: input.directions,
        tags: input.tags.map((tag) => tag.value),
      },
      user
    )
    redirect(`/recipes/${recipe.recipe.id}`)
  })
