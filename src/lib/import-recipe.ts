import * as cheerio from "cheerio"

async function fetchPageHtml(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`)
  }
  return response.text()
}

function tryMetadata(jsonString: string) {
  const structuredData = JSON.parse(jsonString)

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

function tryHtmlSelectors($: cheerio.CheerioAPI) {
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

export async function importRecipe(url: string) {
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
    return tryHtmlSelectors($)
  } catch (error) {
    console.error("Error parsing recipe:", error)
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recipeData.recipeInstructions?.map((inst: any) =>
        typeof inst === "string" ? inst : inst.text
      ) || [],
    photos: recipeData.image,
    datePublished: recipeData.datePublished,
    dateModified: recipeData.dateModified,
    keyWords: recipeData.keywords,
  }
}
