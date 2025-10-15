# Smart Dinner Backend

A Fastify-based backend for the Smart Dinner app, providing AI-powered meal suggestions based on user input (ingredients, mood, diet, etc.).

## Features
- Suggests meal ideas (not full recipes) using OpenAI GPT-5-nano
- Accepts user input: ingredients, mood, diet, cooking method, constraints
- Returns suggestions with title, description, and ingredients
- Robust error handling and always returns frontend-friendly JSON
- CORS enabled for frontend integration

## Endpoints

### Health Check
`GET /`
- Returns: `{ status: 'ok' }`

### Suggest Meal Ideas
`POST /recipes/suggest`
- Request body (JSON):
  ```json
  {
    "ingredients": ["chicken", "rice"],
    "diet": "vegetarian",
    "mood": "comfort food",
    "cookingMethod": "bake",
    "constraints": ["gluten-free"]
  }
  ```
- Response (JSON):
  ```json
  {
    "suggestions": [
      {
        "title": "Hearty Baked Veggie Rice",
        "description": "A comforting vegetarian bake with rice and seasonal vegetables.",
        "ingredients": ["rice", "zucchini", "bell pepper", "cheese"]
      }
    ]
  }
  ```



---

Made with ❤️ by Marnitz Malan