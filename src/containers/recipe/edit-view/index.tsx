"use client"

import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveLeftIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { createSwapy } from "swapy"
import { z } from "zod"

import { RecipeDetails } from "@/types/Recipe"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultipleSelector } from "@/components/multiple-selector"

import { RecipeImage } from "../image"
import { EditIngredients } from "./edit-ingredients"

interface RecipeEditViewProps {
  startRecipe: RecipeDetails
  availableTags: { name: string }[]
  disableEditView: () => void
}

const editRecipeFormSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  servings: z.string().min(1),
  prepTime: z.number().min(0),
  cookTime: z.number().min(0),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced"])
    .nullable()
    .optional(),
  private: z.boolean().default(false),
  ingredients: z.array(z.string()),
  directions: z.array(
    z.object({
      stepNumber: z.number(),
      description: z.string().min(2),
    })
  ),
  photos: z.array(
    z.object({
      photoUrl: z.string().url(),
      defaultPhoto: z.boolean().default(false),
    })
  ),
  tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
})

export function RecipeEditView(props: RecipeEditViewProps) {
  const { startRecipe, availableTags, disableEditView } = props

  const form = useForm<z.infer<typeof editRecipeFormSchema>>({
    resolver: zodResolver(editRecipeFormSchema),
    defaultValues: {
      ...startRecipe,
      description: startRecipe.description ?? "",
      prepTime: startRecipe.prepTime ?? 0,
      tags:
        startRecipe.tags?.map((tag) => ({
          value: tag,
          label: tag,
        })) ?? [],
    },
  })

  function onBackButtonClicked() {
    form.reset()
    disableEditView()
  }

  // on save - create new recipe (all imorted recipes are their own) & redirect to recipe page for newly create recipe
  // NOTE saved recipe and imported recipe cannot be the same - must have at least 1 difference (even 1 character)
  function onSubmit(values: z.infer<typeof editRecipeFormSchema>) {
    console.log(values)
    //execute(values)
  }

  console.log(form.getValues())

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="container flex max-w-[1000px] flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-4">
            <button
              onClick={onBackButtonClicked}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <MoveLeftIcon />
            </button>
            <p className="text-xl">Edit recipe</p>
          </div>

          <Button>Save recipe</Button>
        </div>
        <div className="container max-w-[1000px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
          <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
            <RecipeImage photos={startRecipe.photos} />

            <div className="flex h-full w-full flex-col justify-between space-y-2 md:space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Recipe name"
                        type="text"
                        className="h-12 md:text-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col items-center gap-x-2 gap-y-2 md:flex-row">
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem className="w-[200px]">
                      <FormControl>
                        <Input {...field} placeholder="Servings" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem className="w-[125px]">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Prep time"
                            type="number"
                          />
                          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                            min
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem className="w-[125px]">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Cook time"
                            type="number"
                          />
                          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                            min
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
              console.log("field", field)
              return (
                <FormItem>
                  <FormControl>
                    <MultipleSelector
                      className="bg-background hover:bg-background"
                      options={availableTags.map((tag) => ({
                        value: tag.name,
                        label: tag.name,
                      }))}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Select tags"
                      maxSelected={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} placeholder="Recipe description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-x-16 gap-y-12 md:flex-row md:items-start">
            <div className="md:w-3/4">
              <p className="text-2xl font-bold">Ingredients</p>
              <EditIngredients ingredients={form.getValues().ingredients} />
            </div>

            <div className="w-full">
              <p className="text-2xl font-bold">Directions</p>
              <ul>
                <ul className="space-y-4 pt-4">
                  {startRecipe.directions.map((direction) => {
                    return (
                      <li
                        key={`${direction.stepNumber}-direction`}
                        className="flex flex-row gap-x-2"
                      >
                        <p className="text-xl font-bold text-red-500">
                          {direction.stepNumber}
                        </p>
                        <p className="text-lg">{direction.description}</p>
                      </li>
                    )
                  })}
                </ul>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
