/* eslint-disable */

import * as cheerio from "cheerio"

import { PrimaryKey } from "@/types"
import { RecipeDetails, RecipeDifficulty } from "@/types/Recipe"
import { addRecipeDirections } from "@/data-access/recipe-directions"
import { addRecipeIngredients } from "@/data-access/recipe-ingredients"
import { addRecipeTags } from "@/data-access/recipe-tags"
import { addRecipe } from "@/data-access/recipes"
import { addRecipeImportDetails } from "@/data-access/recipes-import-details"
import { getTagsByName } from "@/data-access/tags"
import { addUserRecipeImport } from "@/data-access/user-recipe-imports"
import { getUser } from "@/data-access/users"
import { createTransaction } from "@/data-access/utils"

async function fetchPageHtml(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Recipe not found")
  }
  return response.text()
}

function tryMetadata(jsonString: string) {
  const structuredData = JSON.parse(jsonString)

  if (Array.isArray(structuredData)) {
    const recipeData = structuredData.find((item) => item["@type"] === "Recipe")
    if (recipeData) {
      return recipeData
    }

    // Could be www.allrecipes.com - they handle schema differently
    if (structuredData.length === 1) {
      return structuredData[0]
    }
  }

  if (structuredData["@graph"] && Array.isArray(structuredData["@graph"])) {
    const recipeData = structuredData["@graph"].find(
      (item) => item["@type"] === "Recipe"
    )
    if (recipeData) {
      return recipeData
    }
  }

  if (structuredData["@type"] === "Recipe") {
    return structuredData
  }

  return undefined
}

async function importRecipe(url: string): Promise<object | null | undefined> {
  try {
    const html = await fetchPageHtml(url)
    const $ = cheerio.load(html)
    const jsonLdScript = $("script[type='application/ld+json']").html()
    if (jsonLdScript) {
      const jsonDetais = tryMetadata(jsonLdScript)
      if (jsonDetais) {
        return jsonDetais
      }
    }
    return null
  } catch (error) {
    return null
  }
}

function formatDuration(duration: string | null) {
  if (!duration) {
    return null
  }

  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/
  const match = duration.match(regex)

  if (!match) {
    return null
  }

  const years = parseInt(match[1] || "0", 10)
  const months = parseInt(match[2] || "0", 10)
  const days = parseInt(match[3] || "0", 10)
  const hours = parseInt(match[4] || "0", 10)
  const minutes = parseInt(match[5] || "0", 10)
  const seconds = parseFloat(match[6] || "0")

  const minutesInHour = 60
  const minutesInDay = minutesInHour * 24
  const minutesInMonth = minutesInDay * 30.44 // Average days per month
  const minutesInYear = minutesInDay * 365.25 // Average days per year

  let totalMinutes = 0

  totalMinutes += years * minutesInYear
  totalMinutes += months * minutesInMonth
  totalMinutes += days * minutesInDay
  totalMinutes += hours * minutesInHour
  totalMinutes += minutes
  totalMinutes += seconds / 60

  return totalMinutes
}

function formatServings(servings: any) {
  if (typeof servings === "number") {
    return `${servings} servings`
  }
  if (typeof servings === "string") {
    if (!Number.isNaN(Number(servings))) {
      return servings
    }
    return servings
  }
  if (Array.isArray(servings)) {
    let intValue
    let strValue
    servings.forEach((item) => {
      if (!Number.isNaN(Number(item))) {
        intValue = item
      } else {
        strValue = item
      }
    })
    if (strValue) {
      return strValue
    }
    return `${intValue} servings`
  }
}

function fixMarkupCharacters(word: string) {
  return word
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "-")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
}

function formatKeywords(keywords: any) {
  function removeWordBeforeColon(val: string): string {
    const colonIndex = val.indexOf(":")
    if (colonIndex === -1) {
      return val // Return original string if no colon is found
    }
    return val.substring(colonIndex + 1)
  }

  function isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime())
  }

  function splitJoinAndUnique(arr: string[]): string[] {
    const splitArrays: string[][] = arr.map((str) => str.split(" "))
    const flattenedArray: string[] = splitArrays.flat()
    const uniqueValues: string[] = [...new Set(flattenedArray)]
    return uniqueValues
  }

  if (Array.isArray(keywords)) {
    return splitJoinAndUnique(
      keywords
        .map((word) => {
          if (typeof word === "string") {
            const fixedVal = fixMarkupCharacters(
              removeWordBeforeColon(word).trim()
            )
            if (!isValidDate(fixedVal)) {
              return fixedVal.toLowerCase()
            }
          }
        })
        .filter((word) => word !== null && word !== undefined)
    )
  }

  if (typeof keywords === "string") {
    return splitJoinAndUnique(
      keywords
        .split(",")
        .map((word) => {
          const fixedVal = fixMarkupCharacters(
            removeWordBeforeColon(word).trim()
          )
          if (!isValidDate(fixedVal)) {
            return fixedVal.toLowerCase()
          }
        })
        .filter((word) => word !== null && word !== undefined)
    )
  }
}

function formatDirections(directions: any) {
  return directions?.map((inst: any, index: number) => ({
    orderNumber: index,
    description: fixMarkupCharacters(
      typeof inst === "string" ? inst : inst.text
    ),
  }))
}

// if totalTime does not match prep and cook time
// add remaining total time to cook time, or subtract from prep time
function handleTimeDescrepency(
  prepTime: number,
  cookTime: number,
  totalTime: number
) {
  if (totalTime < prepTime + cookTime) {
    return {
      prepTime: 0,
      cookTime: totalTime,
    }
  }

  if (totalTime > prepTime + cookTime) {
    return {
      prepTime,
      cookTime: totalTime - prepTime,
    }
  }

  return {
    prepTime,
    cookTime,
  }
}

function getPhoto(photos: any): string | undefined {
  if (Array.isArray(photos)) {
    const holdPhoto = photos.at(0)
    if (typeof holdPhoto === "string") {
      return holdPhoto
    }
    if (holdPhoto["@type"] === "ImageObject") {
      return holdPhoto.url ?? holdPhoto.URL
    }
  }
  if (photos["@type"] === "ImageObject") {
    return photos.url ?? photos.URL
  }
  if (typeof photos === "string") {
    return photos
  }
}

interface FormattedImportRecipeDetails {
  importDetails: {
    importedBy?: PrimaryKey
    url: string
  }
  recipe: {
    title: string
    description?: string | null
    servings: string
    prepTime: number
    cookTime: number
    difficulty?: RecipeDifficulty
    private: boolean
    photo?: string | null
  }
  ingredients: { orderNumber: number; description: string }[]
  directions: { orderNumber: number; description: string }[]
  tags?: string[]
}

function formatData(
  recipeData: any,
  url: string,
  importedBy?: number
): FormattedImportRecipeDetails {
  const { prepTime, cookTime } = handleTimeDescrepency(
    formatDuration(recipeData.prepTime) || 0,
    formatDuration(recipeData.cookTime) || 0,
    formatDuration(recipeData.totalTime) || 0
  )

  return {
    importDetails: {
      importedBy,
      url,
    },
    recipe: {
      title: fixMarkupCharacters(recipeData.name),
      description: recipeData.description
        ? fixMarkupCharacters(recipeData.description)
        : undefined,
      servings: formatServings(recipeData.recipeYield) ?? `1 serving`,
      prepTime,
      cookTime,
      private: false,
      photo: getPhoto(recipeData.image),
    },
    ingredients:
      recipeData.recipeIngredient.map((ing: string, index: number) => ({
        description: fixMarkupCharacters(
          ing.replace("((", "(").replace("))", ")")
        ),
        orderNumber: index,
      })) || [],
    directions: formatDirections(recipeData.recipeInstructions) || [],
    tags: formatKeywords(recipeData.keywords),
  }
}

export async function importRecipeUseCase(url: string, importedBy?: number) {
  const importRecipeData = await importRecipe(url)

  if (!importRecipeData) {
    throw new Error("Recipe not found")
  }

  const formattedRecipeData = formatData(importRecipeData, url, importedBy)

  const { importDetails, recipe, ingredients, directions, tags } =
    formattedRecipeData

  const recipeDetails = await createTransaction(async (trx) => {
    let user
    if (importedBy) {
      user = await getUser(importedBy)
    }

    const newRecipe = await addRecipe(
      {
        title: recipe.title,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        description: recipe.description,
        photo: recipe.photo,
      },
      trx
    )

    const recipeImportDetails = await addRecipeImportDetails(
      {
        importedBy,
        recipeId: newRecipe.id,
        url: importDetails.url,
      },
      trx
    )

    let userRecipeImport
    if (user && recipeImportDetails) {
      userRecipeImport = await addUserRecipeImport(
        {
          recipeImportDetailsId: recipeImportDetails?.id,
          userId: user.id,
        },
        trx
      )
    }

    const recipeIngredients = await addRecipeIngredients(
      newRecipe.id,
      ingredients,
      trx
    )

    const recipeDirections = await addRecipeDirections(
      newRecipe.id,
      directions,
      trx
    )

    let tagsList
    if (tags) {
      tagsList = await getTagsByName(tags)
      if (tagsList.length > 1) {
        await addRecipeTags(newRecipe.id, tagsList, trx)
      }
    }

    return {
      importDetails: recipeImportDetails,
      firstToImportRecipe: user,
      recipe,
      ingredients: recipeIngredients ?? [],
      directions: recipeDirections ?? [],
      tags: tagsList?.map((tag) => tag.name) ?? [],
    }
  })

  return recipeDetails as RecipeDetails
}

export async function addUserRecipeImportUseCase(
  recipeImportDetailsId: PrimaryKey,
  userId: PrimaryKey
) {
  return addUserRecipeImport({
    recipeImportDetailsId,
    userId,
  })
}
