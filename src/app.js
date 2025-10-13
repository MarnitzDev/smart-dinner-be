import Fastify from "fastify";
import cors from "@fastify/cors";

import indexRoutes from "./routes/index.js";
import recipeRoutes from "./routes/recipes.js";

export async function createApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: "*" });
  app.register(indexRoutes);
  app.register(recipeRoutes, { prefix: "/recipes" });
  return app;
}