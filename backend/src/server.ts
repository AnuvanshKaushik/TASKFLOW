import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env, validateEnv } from "./config/env";

const startServer = async () => {
  validateEnv();
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`TaskFlow AI API listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

