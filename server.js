import { createApp } from "./src/app.js";

const start = async () => {
  const app = await createApp();
  const port = process.env.PORT || 5000;
  await app.listen({ port });
  console.log(`🚀 Server running on http://localhost:${port}`);
};

start();