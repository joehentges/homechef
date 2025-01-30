import Link from "next/link"
import { HeartIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { getFeaturedRecipesUseCase } from "@/use-cases/recipes"
import { getFeaturedUsersUseCase } from "@/use-cases/users"
import { FeaturedChefs } from "@/containers/featured-chefs"
import { FeaturedRecipeSearch } from "@/containers/featured-recipe-search"
import { ImportRecipe } from "@/containers/import-recipe"

export default async function HomePage() {
  const featuredRecipes = await getFeaturedRecipesUseCase()
  const featuredChefs = await getFeaturedUsersUseCase()

  function getSeason() {
    const currentMonthIndex = new Date().getMonth()
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ] as const
    const currentMonthName = monthNames[currentMonthIndex]

    const monthArray = seasonalProduce[currentMonthName]
    return monthArray[Math.floor(Math.random() * monthArray.length)]
  }

  const seasonalFood = getSeason().toLowerCase()

  return (
    <div>
      <div
        className={cn(
          "relative -mt-20 h-[450px] overflow-hidden rounded-b-[2rem] bg-primary/20 md:h-[600px] md:rounded-b-[4rem]"
        )}
      >
        <div className="absolute bottom-1 left-1/2 max-w-[250px] -translate-x-1/2 -translate-y-1/2 transform justify-items-center text-center md:top-[50%] md:justify-items-start md:text-start lg:left-[45%]">
          <HeartIcon
            fill="white"
            className="h-4 -rotate-45 text-white md:h-8"
          />
          <p className="text-sm md:text-base">
            New{" "}
            <Link
              href={`/recipes/?search=${seasonalFood}`}
              className="font-bold transition-colors hover:text-foreground/80"
            >
              {seasonalFood}
            </Link>{" "}
            season has started, let&apos;s cook!
          </p>
        </div>
        <div className="absolute bottom-5 right-0 hidden md:mr-[3em] md:flex lg:mr-[6em] xl:mr-[15em] 2xl:mr-[25em]">
          <img
            src="/images/iphone-left-dark.png"
            alt="hero"
            className="hidden h-[500px] dark:block"
          />
          <img
            src="/images/iphone-left-light.png"
            alt="hero"
            className="block h-[500px] dark:hidden"
          />
        </div>

        <div
          className={cn(
            "container flex h-[100%] max-w-[1325px] flex-col items-center justify-center font-header text-7xl font-bold md:items-start md:text-8xl lg:text-9xl"
          )}
        >
          <p>Chef</p>
          <p className="md:ml-32">Featured</p>
          <p>Recipes</p>
        </div>
      </div>

      <div className="space-y-16 pt-16">
        <ImportRecipe />

        {featuredRecipes && (
          <FeaturedRecipeSearch
            recipes={featuredRecipes}
            recipesPerPageLimit={6}
          />
        )}

        <FeaturedChefs chefs={featuredChefs.slice(0, 5)} />
      </div>
    </div>
  )
}

const seasonalProduce = {
  january: [
    "Oranges",
    "Grapefruit",
    "Tangerines",
    "Lemons",
    "Brussels sprouts",
    "Kale",
    "Beets",
    "Leeks",
    "Sweet potatoes",
    "Winter squash",
  ],
  february: [
    "Oranges",
    "Grapefruit",
    "Tangerines",
    "Lemons",
    "Cabbage",
    "Turnips",
    "Brussels sprouts",
    "Kale",
    "Beets",
    "Leeks",
    "Sweet potatoes",
    "Winter squash",
  ],
  march: [
    "Strawberries",
    "Mangoes",
    "Kiwi",
    "Spinach",
    "Swiss chard",
    "Collard greens",
    "Green beans",
    "Broccoli",
    "Radishes",
    "Mushrooms",
  ],
  april: [
    "Strawberries",
    "Mangoes",
    "Kiwi",
    "Peas",
    "Asparagus",
    "Rhubarb",
    "Spinach",
    "Swiss chard",
    "Collard greens",
    "Green beans",
    "Broccoli",
    "Radishes",
    "Mushrooms",
  ],
  may: [
    "Apricots",
    "Strawberries",
    "Mangoes",
    "Kiwi",
    "Zucchini",
    "Okra",
    "Peas",
    "Asparagus",
    "Rhubarb",
    "Spinach",
    "Swiss chard",
    "Collard greens",
    "Green beans",
    "Broccoli",
    "Radishes",
    "Mushrooms",
  ],
  june: [
    "Cherries",
    "Blueberries",
    "Blackberries",
    "Raspberries",
    "Peaches",
    "Plums",
    "Cantaloupe",
    "Watermelon",
    "Avocados",
    "Bell peppers",
    "Cucumbers",
    "Corn",
    "Tomatoes",
  ],
  july: [
    "Cherries",
    "Blueberries",
    "Blackberries",
    "Raspberries",
    "Peaches",
    "Plums",
    "Cantaloupe",
    "Watermelon",
    "Avocados",
    "Bell peppers",
    "Cucumbers",
    "Corn",
    "Tomatoes",
    "Zucchini",
  ],
  august: [
    "Berries",
    "Peaches",
    "Melons",
    "Mangoes",
    "Apricots",
    "Kiwi",
    "Eggplant",
    "Bell peppers",
    "Cucumbers",
    "Corn",
    "Tomatoes",
    "Green beans",
    "Summer squash",
  ],
  september: [
    "Cranberries",
    "Grapes",
    "Apples",
    "Pears",
    "Pumpkin",
    "Pomegranates",
    "Kale",
    "Mushrooms",
    "Potatoes",
    "Broccoli",
    "Cauliflower",
    "Yams",
    "Parsnips",
    "Beets",
    "Turnips",
    "Winter squash",
  ],
  october: [
    "Grapes",
    "Cranberries",
    "Apples",
    "Pears",
    "Pomegranates",
    "Kale",
    "Mushrooms",
    "Celery",
    "Potatoes",
    "Broccoli",
    "Cauliflower",
    "Brussels sprouts",
    "Yams",
    "Parsnips",
    "Beets",
    "Turnips",
    "Winter squash",
  ],
  november: [
    "Grapes",
    "Cranberries",
    "Apples",
    "Pears",
    "Pomegranates",
    "Pumpkins",
    "Oranges",
    "Kale",
    "Mushrooms",
    "Celery",
    "Potatoes",
    "Broccoli",
    "Cauliflower",
    "Brussels sprouts",
    "Yams",
    "Parsnips",
    "Beets",
    "Turnips",
    "Winter squash",
  ],
  december: [
    "Pears",
    "Pomegranates",
    "Kale",
    "Collard greens",
    "Turnips",
    "Sweet potatoes",
  ],
}
