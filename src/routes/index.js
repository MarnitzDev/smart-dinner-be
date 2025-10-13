export default async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return {
      message: 'Welcome to the Smart Dinner API',
      version: '1.0.0',
      docs: null // Add docs URL if available
    };
  });
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', message: 'API is healthy' };
  });
}