"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { rateLimitByKey } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import {
  addRecipeUseCase,
  deleteRecipeUseCase,
  updateRecipeUseCase,
} from "@/use-cases/recipes"

const recipeAddOrUpdateActionSchema = z.object({
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
  .input(recipeAddOrUpdateActionSchema)
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
          difficulty: input.recipe.difficulty ?? null,
        },
        ingredients: input.ingredients.map((ingredient, index) => ({
          description: ingredient.description,
          orderNumber: index,
        })),
        directions: input.directions.map((directions, index) => ({
          description: directions.description,
          orderNumber: index,
        })),
        tags: input.tags.map((tag) => tag.value),
      },
      user
    )

    redirect(`/recipes/${recipe.recipe.id}`)
  })

export const updateRecipeAction = authenticatedAction
  .createServerAction()
  .input(recipeAddOrUpdateActionSchema)
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
          difficulty: input.recipe.difficulty ?? null,
        },
        ingredients: input.ingredients.map((ingredient, index) => ({
          description: ingredient.description,
          orderNumber: index,
        })),
        directions: input.directions.map((directions, index) => ({
          description: directions.description,
          orderNumber: index,
        })),
        tags: input.tags.map((tag) => tag.value),
      },
      user
    )
    revalidatePath(`/recipes/${recipe.recipe.id}`)
  })

export const saveRecipeAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      recipeId: z.number(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    //
  })

export const unsaveRecipeAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      recipeId: z.number(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    //
  })

export const deleteRecipeAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      recipeId: z.number(),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `delete-recipe-author-${user.id}`,
      limit: 3,
      window: 10000,
    })
    await deleteRecipeUseCase(input.recipeId)
    redirect(`/profile/${user.id}`)
  })
