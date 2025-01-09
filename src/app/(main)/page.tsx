import { HeartIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { getRandomRecipesUseCase } from "@/use-cases/recipes"
import { FeaturedRecipeSearch } from "@/containers/featured-recipe-search"
import { FeaturedVideos } from "@/containers/featured-videos"
import { ImportRecipe } from "@/containers/import-recipe"

const videos = [
  {
    href: "https://www.youtube.com/watch?v=P6W8kwmwcno",
    title: "Learn How To Cook in Under 25 Minutes",
    description: "Let's fast track and make cooking easy.",
    creator: "Joshua Weissman",
    creatorHref: "https://www.youtube.com/@JoshuaWeissman",
    imageHref: "https://img.youtube.com/vi/P6W8kwmwcno/hqdefault.jpg",
    length: "24:11",
    date: "Nov 17, 2024",
  },
  {
    href: "https://www.youtube.com/watch?v=pkeS36-3ge8",
    title: "How to Cook A Perfect Standing Prime Ribs",
    description:
      "I cook a perfect standing prime rib, searing it to lock in juices and roasting it until tender and flavorful! The golden crust is rich and crispy, while the inside stays juicy and soft! 🔥",
    creator: "WILDERNESS COOKING",
    creatorHref: "https://www.youtube.com/@WILDERNESSCOOKING",
    imageHref: "https://img.youtube.com/vi/pkeS36-3ge8/hqdefault.jpg",
    length: "17:49",
    date: "Dec 23, 2024",
  },
  {
    href: "https://www.youtube.com/watch?v=SOUvvDTBdic&t=197s",
    title:
      "How One of NYC’s Best Indian Chefs Makes Biryani | Made to Order | Bon Appétit",
    description:
      "Today, one of NYC’s best Indian chefs, Chintan Kiran Pandya, demonstrates how he cooks the perfect Biryani. Pandya owns Dhamaka, one of New York’s most popular Indian restaurants, but even top chefs still love the classic dishes you can make at home. ",
    creator: "Bon Appétit",
    creatorHref: "https://www.youtube.com/@bonappetit",
    imageHref: "https://img.youtube.com/vi/SOUvvDTBdic/hqdefault.jpg",
    length: "14:07",
    date: "Dec 17, 2024",
  },
]

export default async function HomePage() {
  const randomRecipes = await getRandomRecipesUseCase(24)

  return (
    <div>
      <div
        className={cn(
          "relative -mt-20 h-[450px] overflow-hidden rounded-b-[2rem] bg-primary/20 md:h-[600px] md:rounded-b-[4rem]"
        )}
      >
        <div className="absolute left-[15%] top-[80%] flex max-w-[250px] gap-x-3 md:left-[35%] md:top-[28%]">
          <HeartIcon
            fill="white"
            className="h-4 -rotate-45 text-white md:h-8"
          />
          <p className="text-sm md:text-base">
            New pumpkin season has started, let&apos;s cook!
          </p>
        </div>
        <div className="absolute bottom-0 right-0 hidden md:mr-[5em] md:flex lg:mr-[6em] xl:mr-[15em] 2xl:mr-[20em]">
          <img
            src="/images/halloween-pumpkins.png"
            alt="hero"
            className="max-h-[450px] max-w-[400px] lg:max-w-[500px] xl:max-w-[550px]"
          />
        </div>

        <div
          className={cn(
            "container flex h-[100%] flex-col items-center justify-center font-header text-6xl font-bold md:items-start md:text-7xl lg:text-8xl xl:text-9xl"
          )}
        >
          <p>Chef</p>
          <p className="md:ml-32">Featured</p>
          <p>Recipes</p>
        </div>
      </div>

      <div className="space-y-16 py-16">
        <ImportRecipe />

        {randomRecipes && (
          <FeaturedRecipeSearch
            recipes={randomRecipes}
            recipesPerPageLimit={6}
          />
        )}

        <FeaturedVideos videos={videos} />
      </div>
    </div>
  )
}
