import { CompleteRecipeSeed } from "./recipes.types"

const recipeId = 1

export const theBestChocolateChipCookieRecipeEver: CompleteRecipeSeed = {
  recipe: {
    id: recipeId,
    userId: 1,
    title: "The Best Chocolate Chip Cookie Recipe Ever",
    description:
      "This is the best chocolate chip cookie recipe ever. No funny ingredients, no chilling time, etc. Just a simple, straightforward, amazingly delicious, doughy yet still fully cooked, chocolate chip cookie that turns out perfectly every single time!",
    prepTime: 10,
    cookTime: 8,
    difficulty: "easy",
    servings: "36 cookies",
  },
  recipeImportDetails: {
    id: 1,
    recipeId,
    name: "joyfoodsunshine.com",
    url: "https://joyfoodsunshine.com/the-most-amazing-chocolate-chip-cookies/",
  },
  recipeIngredients: [
    {
      id: 1,
      recipeId,
      description: "1 cup butter softened",
    },
    {
      id: 2,
      recipeId,
      description: "1 cup granulated sugar",
    },
    {
      id: 3,
      recipeId,
      description: "1 cup light brown sugar packed",
    },
    {
      id: 4,
      recipeId,
      description: "2 teaspoons pure vanilla extract",
    },
    {
      id: 5,
      recipeId,
      description: "2 large eggs",
    },
    {
      id: 6,
      recipeId,
      description: "3 cups all-purpose flour",
    },
    {
      id: 7,
      recipeId,
      description: "1 teaspoon baking soda",
    },
    {
      id: 8,
      recipeId,
      description: "½ teaspoon baking powder",
    },
    {
      id: 9,
      recipeId,
      description: "1 teaspoon sea salt",
    },
    {
      id: 10,
      recipeId,
      description: "2 cups chocolate chips (12 oz)",
    },
  ],
  recipeDirections: [
    {
      id: 1,
      recipeId,
      stepNumber: 1,
      description:
        "Preheat oven to 375 degrees F. Line three baking sheets with parchment paper and set aside.",
    },
    {
      id: 2,
      recipeId,
      stepNumber: 2,
      description:
        "In a medium bowl mix flour, baking soda, baking powder and salt. Set aside.",
    },
    {
      id: 3,
      recipeId,
      stepNumber: 3,
      description: "Cream together butter and sugars until combined.",
    },
    {
      id: 4,
      recipeId,
      stepNumber: 4,
      description: "Beat in eggs and vanilla until light (about 1 minute).",
    },
    {
      id: 5,
      recipeId,
      stepNumber: 5,
      description: "Mix in the dry ingredients until combined.",
    },
    {
      id: 6,
      recipeId,
      stepNumber: 6,
      description: "Add chocolate chips and mix well.",
    },
    {
      id: 7,
      recipeId,
      stepNumber: 7,
      description:
        "Roll 2-3 Tablespoons (depending on how large you like your cookies) of dough at a time into balls and place them evenly spaced on your prepared cookie sheets.",
    },
    {
      id: 8,
      recipeId,
      stepNumber: 8,
      description:
        "Bake in preheated oven for approximately 8-10 minutes. Take them out when they are just barely starting to turn brown.",
    },
    {
      id: 9,
      recipeId,
      stepNumber: 9,
      description:
        "Let them sit on the baking pan for 5 minutes before removing to cooling rack.",
    },
  ],
  recipeTags: [
    {
      id: 1,
      recipeId,
      tagId: 1,
    },
    {
      id: 2,
      recipeId,
      tagId: 2,
    },
    {
      id: 3,
      recipeId,
      tagId: 3,
    },
  ],
  recipePhotos: [
    {
      id: 1,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-5.jpg",
      defaultPhoto: true,
    },
    {
      id: 2,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-3.jpg",
      defaultPhoto: false,
    },
    {
      id: 3,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookie-recipe-cooling.jpg",
      defaultPhoto: false,
    },
    {
      id: 4,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/how-to-make-chocolate-chip-cookies-7.jpg",
      defaultPhoto: false,
    },
    {
      id: 5,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/how-to-freeze-chocolate-chip-cookie-dough.jpg",
      defaultPhoto: false,
    },
    {
      id: 6,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/how-to-make-chocolate-chip-cookies-6-1.jpg",
      defaultPhoto: false,
    },
    {
      id: 7,
      recipeId,
      photoUrl:
        "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-6.jpg",
      defaultPhoto: false,
    },
  ],
}
