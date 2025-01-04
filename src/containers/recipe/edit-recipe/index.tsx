"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ClockIcon, MoveLeftIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { FormattedRecipeDetails } from "@/types/Recipe"
import { formatTime } from "@/lib/format-time"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AutosizeTextarea } from "@/components/autosize-textarea"
import { LoaderButton } from "@/components/loader-button"
import { MultipleSelector } from "@/components/multiple-selector"
import { useToast } from "@/hooks/use-toast"

import { addRecipeAction, updateRecipeAction } from "../actions"
import { EditDifficulty } from "./edit-difficulty"
import { EditDirections } from "./edit-directions"
import { EditImage } from "./edit-image"
import { EditIngredients } from "./edit-ingredients"
import { SaveRecipe } from "./save-recipe"

interface EditRecipeProps {
  newRecipe?: boolean
  isRecipeOwner: boolean
  startRecipe: FormattedRecipeDetails
  availableTags: { name: string }[]
  onDisableEditView?: () => void
}

const recipeActionFormSchema = z.object({
  recipe: z.object({
    id: z.coerce.number().optional(),
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

export function EditRecipe(props: EditRecipeProps) {
  const {
    newRecipe,
    isRecipeOwner,
    startRecipe,
    availableTags,
    onDisableEditView,
  } = props
  const { toast } = useToast()

  const { execute, isPending } = useServerAction(
    isRecipeOwner ? updateRecipeAction : addRecipeAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        })
      },
      onSuccess() {
        toast({
          title: `Successfully ${newRecipe ? "created" : "updated"} recipe`,
          description: `Take a look at your ${newRecipe ? "new" : "updated"} recipe`,
        })
        if (onDisableEditView) {
          onDisableEditView()
        }
      },
    }
  )

  const form = useForm<z.infer<typeof recipeActionFormSchema>>({
    resolver: zodResolver(recipeActionFormSchema),
    defaultValues: {
      recipe: {
        id: startRecipe.recipe.id,
        title: startRecipe.recipe.title,
        servings: startRecipe.recipe.servings,
        prepTime: startRecipe.recipe.prepTime,
        cookTime: startRecipe.recipe.cookTime,
        difficulty: startRecipe.recipe.difficulty,
        private: startRecipe.recipe.private,
        description: startRecipe.recipe.description ?? "",
        photo: startRecipe.recipe.photo ?? undefined,
      },
      ingredients: startRecipe.ingredients,
      directions: startRecipe.directions,
      tags:
        startRecipe.tags?.map((tag) => ({
          value: tag,
          label: tag,
        })) ?? [],
    },
  })

  function onBackButtonClicked() {
    form.reset()
    if (onDisableEditView) {
      onDisableEditView()
    }
  }

  // on save - create new recipe (all imorted recipes are their own) & redirect to recipe page for newly create recipe
  // NOTE saved recipe and imported recipe cannot be the same - must have at least 1 difference (even 1 character)
  function onSubmit(values: z.infer<typeof recipeActionFormSchema>) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="container flex max-w-[1000px] flex-col items-center justify-between gap-y-4 sm:flex-row">
          <div className="flex flex-row items-center gap-x-4">
            {onDisableEditView && (
              <button
                onClick={onBackButtonClicked}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <MoveLeftIcon />
              </button>
            )}
            <p className="text-xl">{newRecipe ? "New" : "Edit"} recipe</p>
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <FormField
              control={form.control}
              name="recipe.private"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                      <Switch
                        id="switch-13"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="peer absolute inset-0 h-[inherit] w-auto data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                      />
                      <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                        <span className="text-[10px] font-medium uppercase">
                          Public
                        </span>
                      </span>
                      <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
                        <span className="text-[10px] font-medium uppercase">
                          Private
                        </span>
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SaveRecipe
              isPending={isPending}
              isDirty={form.formState.isDirty}
              label={`${newRecipe ? "Create" : "Update"} recipe`}
              isRecipeOwner={isRecipeOwner}
            />
          </div>
        </div>

        <div className="container max-w-[1000px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
          <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
            <FormField
              control={form.control}
              name="recipe.photo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditImage photo={field.value} setPhoto={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex h-full w-full flex-col justify-between space-y-2 md:space-y-8">
              <FormField
                control={form.control}
                name="recipe.title"
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
                  name="recipe.servings"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="Servings" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full flex-row gap-x-2 md:w-auto">
                  <FormField
                    control={form.control}
                    name="recipe.prepTime"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-[100px] md:max-w-[125px]">
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
                    name="recipe.cookTime"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-[100px] md:max-w-[125px]">
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

                <FormField
                  control={form.control}
                  name="recipe.difficulty"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-auto">
                      <FormControl>
                        <EditDifficulty
                          difficulty={field.value}
                          setDifficulty={field.onChange}
                        />
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
            render={({ field }) => (
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
            )}
          />

          <FormField
            control={form.control}
            name="recipe.description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AutosizeTextarea
                    {...field}
                    placeholder="Recipe description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-x-10 gap-y-12 md:flex-row md:items-start">
            <div className="select-none md:w-3/4">
              <p className="pb-3 text-2xl font-bold">Ingredients</p>
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    {form.formState.errors.ingredients && (
                      <p className="text-sm text-destructive">
                        Ingredients must be at least 3 characters
                      </p>
                    )}
                    <FormControl>
                      <EditIngredients
                        ingredients={field.value}
                        setIngredients={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full select-none">
              <p className="pb-3 text-2xl font-bold">Directions</p>
              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem>
                    {form.formState.errors.ingredients && (
                      <p className="text-sm text-destructive">
                        Directions must be at least 3 characters
                      </p>
                    )}
                    <FormControl>
                      <EditDirections
                        directions={field.value}
                        setDirections={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
