import { parseRecipeSuggestions } from '../utils/parseRecipeSuggestions.js';

export async function suggestRecipes(request, reply) {
		const {
			diet = '',
			cookingMethod = '',
			mood = '',
			ingredients = [],
			constraints = []
		} = request.body;

	// Build a detailed prompt for the AI
	let prompt = 'Suggest 3 recipes with title, 1–2 sentence description, and ingredients list.';
	if (diet) prompt = `Diet: ${diet}. ` + prompt;
	if (cookingMethod) prompt = `Cooking method: ${cookingMethod}. ` + prompt;
	if (mood) prompt = `Mood: ${mood}. ` + prompt;
	if (ingredients.length) prompt = `User has: ${ingredients.join(", ")}. ` + prompt;
	if (constraints.length) prompt = `Constraints: ${constraints.join(", ")}. ` + prompt;
	prompt += '\nRespond ONLY with a JSON array of objects, each with: title, description, and ingredients (array of strings).';
	prompt += '\nEvery object must include all fields.';
	prompt += '\nExample:';
	prompt += '\n[';
	prompt += '\n  {';
	prompt += '\n    "title": "Suggestion Name",';
	prompt += '\n    "description": "Short description.",';
	prompt += '\n    "ingredients": ["ingredient 1", "ingredient 2"]';
	prompt += '\n  }';
	prompt += '\n]';

		try {
			const response = await fetch('https://api.openai.com/v1/responses', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'gpt-5-nano',
					input: prompt,
					store: false
				})
			});
			if (!response.ok) {
				const error = await response.text();
				return reply.code(response.status).send({ error });
			}
				const data = await response.json();
				console.log('OpenAI API response:', data);
				// Extract the recipe suggestions from the correct field
				if (data && Array.isArray(data.output)) {
					// Find the message type output
					const message = data.output.find(o => o.type === 'message');
					console.log('AI message object:', message);
					if (!message) {
						return reply.code(500).send({ error: 'AI response missing message type output', details: data });
					}
					console.log('AI message.content:', message.content);
					const contentArr = message.content;
					let text = '';
					if (Array.isArray(contentArr) && contentArr[0] && typeof contentArr[0].text === 'string') {
						text = contentArr[0].text;
					} else {
						// fallback: try to stringify the first content object or return empty string
						text = JSON.stringify(contentArr[0] || {});
					}
					let recipes = [];
					try {
						// Try to parse as JSON first
						recipes = JSON.parse(text);
						// Ensure it's an array of objects with required fields
						if (!Array.isArray(recipes) || !recipes.every(r => r.title && r.description && Array.isArray(r.ingredients))) {
							throw new Error('JSON does not match expected format');
						}
					} catch (e) {
						// fallback: try text parser
						try {
							recipes = parseRecipeSuggestions(text);
						} catch (e2) {
							// fallback: just return the raw text as a single suggestion
							recipes = [{ title: 'AI Recipe Suggestions', description: text, ingredients: [] }];
						}
					}
					// Only return title, description, and ingredients fields
					recipes = recipes.map(r => ({
						title: r.title,
						description: r.description,
						ingredients: Array.isArray(r.ingredients) ? r.ingredients : []
					}));
					// Always return a JSON response, even if empty
					return { suggestions: recipes };
				}
				// Fallback: return the whole data object
				return data;
		} catch (err) {
			return reply.code(500).send({ error: 'Failed to fetch recipes from AI', details: err.message });
		}
}

