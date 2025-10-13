import { getAllRecipes } from '../controllers/recipeController.js';

export default async function (fastify, opts) {
	fastify.get('/', getAllRecipes);
}
