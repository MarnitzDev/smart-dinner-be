// Utility to parse AI recipe suggestions from text
export function parseRecipeSuggestions(inputText) {
  console.log('Raw AI recipe text:', text);
  const recipes = [];
  const lines = text.split(/\r?\n/);
  let currentRecipe = null;
  let collectingIngredients = false;

  for (let line of lines) {
    line = line.trim();

    // Start of a new recipe
    const recipeStart = line.match(/^\d+\)\s*(.*)/);
    if (recipeStart) {
      if (currentRecipe) recipes.push(currentRecipe);
      currentRecipe = { title: recipeStart[1], description: '', ingredients: [], link: null };
      collectingIngredients = false;
      continue;
    }

    if (!currentRecipe) continue;

    // Description line
    if (line.startsWith('- Description:')) {
      currentRecipe.description = line.replace('- Description:', '').trim();
      collectingIngredients = false;
    }
    // Start collecting ingredients
    else if (line.startsWith('- Ingredients')) {
      collectingIngredients = true;
    }
    // Link line (extract link if present)
    else if (line.startsWith('- Link:') || line.startsWith('- Link to real recipe:') || line.startsWith('- Real recipe link:')) {
      const linkMatch = line.match(/https?:\/\/\S+/);
      if (linkMatch) currentRecipe.link = linkMatch[0];
      collectingIngredients = false;
    }
    // Ignore 'Serves' or similar lines
    else if (line.startsWith('- Serves:')) {
      // do nothing
    }
    // Ingredient line
    else if (collectingIngredients && line.startsWith('- ')) {
      currentRecipe.ingredients.push(line.replace('- ', '').trim());
    }
    // Ignore lines like '  - ' (indented) that are not ingredients
    else if (collectingIngredients && line.match(/^\d/)) {
      // do nothing
    }
    // Any other non-empty line while collecting ingredients
    else if (collectingIngredients && line.length > 0 && !line.startsWith('-')) {
      currentRecipe.ingredients.push(line.trim());
    }
  }

  if (currentRecipe) recipes.push(currentRecipe);
  return recipes.filter(r => r.title);
}
