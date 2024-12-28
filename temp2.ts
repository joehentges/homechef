import { writeFileSync } from "fs"
import * as cheerio from "cheerio"

const JSONToFile = (obj: any, filename: string) =>
  writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2))

async function fetchPageHtml(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`)
  }
  return response.text()
}

function useMetadata(jsonString: string) {
  const structuredData = JSON.parse(jsonString)
  JSONToFile(structuredData, "temp")

  if (Array.isArray(structuredData)) {
    const recipeData = structuredData.find((item) => item["@type"] === "Recipe")
    if (recipeData) {
      return formatData(recipeData)
    }
  }

  if (structuredData["@graph"] && Array.isArray(structuredData["@graph"])) {
    const recipeData = structuredData["@graph"].find(
      (item) => item["@type"] === "Recipe"
    )
    if (recipeData) {
      return formatData(recipeData)
    }
  }

  if (structuredData["@type"] === "Recipe") {
    return formatData(structuredData)
  }

  return undefined
}

function useHtmlSelectors($: cheerio.CheerioAPI) {
  const title = $("h1").text().trim() || $("title").text().trim()
  const servings = $(".servings").text().trim()
  const cookTime = $(".cook-time").text().trim()
  const ingredients = $(".ingredients li")
    .map((_, el) => $(el).text().trim())
    .get()
  const directions = $(".instructions p, .directions p")
    .map((_, el) => $(el).text().trim())
    .get()

  return {
    title,
    servings,
    cookTime,
    ingredients,
    directions,
  }
}

async function getRecipe(url: string) {
  try {
    const html = await fetchPageHtml(url)
    const $ = cheerio.load(html)
    const jsonLdScript = $("script[type='application/ld+json']").html()
    if (jsonLdScript) {
      const jsonDetais = useMetadata(jsonLdScript)
      if (jsonDetais) {
        return jsonDetais
      }
    }
    return useHtmlSelectors($)
  } catch (error) {
    console.error("Error parsing recipe:", error)
    return null
  }
}

async function main(url: string) {
  const recipe = await getRecipe(url)
  JSONToFile(recipe, "temp-recipe")
  if (recipe) {
    console.log("Recipe Details:", recipe)
  } else {
    console.log("Failed to extract recipe details.")
  }
}

function formatData(recipeData: any) {
  return {
    author: recipeData.author,
    title: recipeData.name,
    description: recipeData.description,
    servings: recipeData.recipeYield,
    prepTime: recipeData.prepTime,
    cookTime: recipeData.cookTime,
    totalTime: recipeData.totalTime,
    ingredients: recipeData.recipeIngredient || [],
    directions:
      recipeData.recipeInstructions?.map((inst: any) =>
        typeof inst === "string" ? inst : inst.text
      ) || [],
    photos: recipeData.image,
    datePublished: recipeData.datePublished,
    dateModified: recipeData.dateModified,
    keyWords: recipeData.keywords,
  }
}

const url1 =
  "https://joyfoodsunshine.com/the-most-amazing-chocolate-chip-cookies/"
const url2 =
  "https://www.foodnetwork.com/recipes/rachael-ray/sausage-stuffed-mushrooms-recipe-1940639"
const url3 =
  "https://www.thekitchn.com/how-to-make-great-ribs-in-the-oven-cooking-lessons-from-the-kitchn-96973"

main("http://localhost:3000/recipes/1")
