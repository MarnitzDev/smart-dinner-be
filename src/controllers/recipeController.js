import { parseRecipeSuggestions } from '../utils/parseRecipeSuggestions.js';

export async function suggestRecipes(request, reply) {
	const { ingredients = [], constraints = [] } = request.body;
	const prompt = `User has: ${ingredients.join(", ")}\nUser wants: ${constraints.join(", ")} recipes. Suggest 3 recipes with title, 1–2 sentence description, ingredients list, and a link to a real recipe if possible.`;

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
						if (message && message.content && message.content[0] && message.content[0].text) {
									const text = message.content[0].text;
											const recipes = parseRecipeSuggestions(text);
											return { suggestions: recipes };
						}
					}
					// Fallback: return the whole data object
					return data;
		} catch (err) {
			return reply.code(500).send({ error: 'Failed to fetch recipes from AI', details: err.message });
		}
}

export async function getAllRecipes(request, reply) {
	// Placeholder: return a static list for now
	return [
		{ id: 1, name: 'Spaghetti Bolognese' },
		{ id: 2, name: 'Chicken Curry' }
	];
}
