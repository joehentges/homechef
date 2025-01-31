"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Recipe } from "@/db/schemas"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/hooks/use-toast"

import { deleteRecipeAction } from "../actions"

interface DeleteRecipeProps {
  recipeId: Recipe["id"]
  title: Recipe["title"]
}

const deleteRecipeForm = z
  .object({
    recipeId: z.number(),
    originalTitle: z.string().min(1),
    input: z.string().min(1),
  })
  .refine(({ originalTitle, input }) => originalTitle === input, {
    message: "Title does not match original",
    path: ["input"],
  })

export function DeleteRecipe(props: DeleteRecipeProps) {
  const { recipeId, title } = props
  const { toast } = useToast()

  const { execute, isPending } = useServerAction(deleteRecipeAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Successfully deleted recipe",
        description: "You have successfully delete your recipe",
      })
    },
  })

  const form = useForm<z.infer<typeof deleteRecipeForm>>({
    resolver: zodResolver(deleteRecipeForm),
    defaultValues: {
      recipeId,
      originalTitle: title,
      input: "",
    },
  })

  function onSubmit(values: z.infer<typeof deleteRecipeForm>) {
    execute(values)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          form.reset()
        }
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <DialogTrigger asChild>
            <TooltipTrigger
              asChild
              className="transition-colors hover:text-foreground"
            >
              <TrashIcon className="h-5 w-5" />
            </TooltipTrigger>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Delete recipe</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your <span className="text-foreground">{title}</span> recipe
                    and remove all data about it from the our servers.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          placeholder="Enter the recipe title"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <LoaderButton isLoading={isPending} type="submit">
                    Delete recipe
                  </LoaderButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
          <TooltipContent>
            <p>Delete the recipe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dialog>
  )
}
