
import 'dotenv/config';
import { createApp } from "./src/app.js";

const start = async () => {
  const app = await createApp();
  const port = process.env.PORT || 5000;
  await app.listen({ port, host: '0.0.0.0' });
  const publicUrl = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.PUBLIC_URL || null;
  if (publicUrl) {
    console.log(`🚀 Server running on https://${publicUrl}`);
  } else {
    console.log(`🚀 Server running on http://localhost:${port}`);
  }
};

start();