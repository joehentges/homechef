"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DialogDescription } from "@radix-ui/react-dialog"
import { CookingPotIcon, SearchIcon } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Recipe, User } from "@/db/schemas"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { UserAvatar } from "@/components/user-avatar"
import { useDebounce } from "@/hooks/use-debounce"

import { searchRecipesAndUsersAction } from "./actions"

interface SiteSearchProps {
  initialrecipes?: Recipe[]
  initialusers?: User[]
}

export function SiteSearch(props: SiteSearchProps) {
  const { initialrecipes = [], initialusers = [] } = props

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [recipesResult, setRecipeResult] = useState<Recipe[]>(initialrecipes)
  const [usersResult, setUsersResult] = useState<User[]>([])
  const debouncedQuery = useDebounce(search, 500)

  const { execute, isPending } = useServerAction(searchRecipesAndUsersAction, {
    onError() {
      setRecipeResult(initialrecipes)
      setUsersResult(initialusers)
    },
    onSuccess({ data }) {
      setRecipeResult(data.recipes)
      setUsersResult(data.users)
    },
  })

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        // Clear results if query is empty
        setRecipeResult(initialrecipes)
        setUsersResult(initialusers)
        return
      }
      execute({ search: debouncedQuery })
    }

    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  function onOptionSelected(route: string) {
    router.push(route)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        className="px-2-start w-full justify-start border text-base hover:bg-transparent hover:text-foreground/70 md:w-auto md:border-none md:p-0"
        onClick={() => setOpen(true)}
        {...props}
      >
        <SearchIcon />
        Search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Recupe and Chef Search</DialogTitle>
        <DialogDescription className="hidden">
          Search for recipes and users.
        </DialogDescription>
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="p-1">
          {!isPending && recipesResult.length < 1 && usersResult.length < 1 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {isPending && (
            <div className="animate-pulse">
              <CommandEmpty>Searching...</CommandEmpty>
            </div>
          )}
          {!isPending && recipesResult.length > 0 && (
            <div>
              <p className="pb-1 pl-4 pt-2 text-xs text-muted-foreground">
                Recipes
              </p>
              {recipesResult.map((recipe) => (
                <Button
                  key={recipe.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onOptionSelected(`/recipes/${recipe.id}`)}
                >
                  {recipe.photo ? (
                    <img
                      src={recipe.photo}
                      alt="Recipe"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="z-10 h-6 w-6 rounded-full bg-white dark:bg-black">
                      <div className="relative h-full w-full rounded-full bg-primary/30 transition-colors group-hover:bg-primary/40">
                        <CookingPotIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  {recipe.title}
                </Button>
              ))}
            </div>
          )}
          {!isPending && usersResult.length > 0 && (
            <div>
              <p className="pb-1 pl-4 pt-2 text-xs text-muted-foreground">
                Chefs
              </p>
              {usersResult.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onOptionSelected(`/users/${user.id}`)}
                >
                  <UserAvatar
                    displayName={user.displayName}
                    image={user.image}
                    className="h-6 w-6 border-2 border-slate-800"
                  />
                  {user.displayName}
                </Button>
              ))}
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
