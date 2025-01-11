"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ScrollIcon, SearchIcon, UserIcon } from "lucide-react"
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
import { useDebounce } from "@/hooks/use-debounce"

import { searchRecipesAndUsersAction } from "./actions"

interface SearchProps {
  initialSearchRecipes?: Recipe[]
  initialSearchUsers?: Omit<User, "password">[]
}

export function Search(props: SearchProps) {
  const { initialSearchRecipes = [], initialSearchUsers = [] } = props

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [recipesResult, setRecipeResult] =
    useState<Recipe[]>(initialSearchRecipes)
  const [usersResult, setUsersResult] = useState<Omit<User, "password">[]>([])
  const debouncedQuery = useDebounce(search, 500)

  const { execute, isPending } = useServerAction(searchRecipesAndUsersAction, {
    onError({ err }) {
      console.log("err", err)
      setRecipeResult(initialSearchRecipes)
      setUsersResult(initialSearchUsers)
    },
    onSuccess({ data }) {
      console.log(data)
      setRecipeResult(data.recipes)
      setUsersResult(data.users)
    },
  })

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        // Clear results if query is empty
        setRecipeResult(initialSearchRecipes)
        setUsersResult(initialSearchUsers)
        return
      }
      execute({ search: debouncedQuery })
    }

    fetchResults()
  }, [debouncedQuery])

  console.log(isPending, recipesResult)

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
        <DialogTitle className="hidden">Website Search</DialogTitle>
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
                  <ScrollIcon className="h-3 w-3" />
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
                  <UserIcon className="h-3 w-3" />
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
