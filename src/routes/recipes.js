import { getAllRecipes, suggestRecipes } from '../controllers/recipeController.js';

export default async function (fastify, opts) {
	fastify.get('/', getAllRecipes);
	fastify.post('/suggest', suggestRecipes);
}
