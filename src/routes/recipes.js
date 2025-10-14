import { suggestRecipes } from '../controllers/recipeController.js';

export default async function (fastify, opts) {
	fastify.post('/suggest', suggestRecipes);
}
