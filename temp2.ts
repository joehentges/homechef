/* eslint-disable */

import { writeFileSync } from "fs"

import { importRecipe } from "@/lib/import-recipe"

const JSONToFile = (obj: any, filename: string) =>
  writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2))

const url1 =
  "https://joyfoodsunshine.com/the-most-amazing-chocolate-chip-cookies/"
const url2 =
  "https://www.foodnetwork.com/recipes/rachael-ray/sausage-stuffed-mushrooms-recipe-1940639"
const url3 =
  "https://www.thekitchn.com/how-to-make-great-ribs-in-the-oven-cooking-lessons-from-the-kitchn-96973"
const url4 =
  "https://www.allrecipes.com/recipe/35304/how-to-make-pico-de-gallo/"

async function main(url: string) {
  const recipe = await importRecipe(url)
  JSONToFile(recipe, "temp-recipe")
}
main(url3)
