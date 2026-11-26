import { buildApp } from "./app.js";
import { loadConfig, type Config } from "./config.js";

let config: Config;
try {
  config = loadConfig();
} catch (error) {
  // Fail fast: never start with bad config.
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const fastifyApp = buildApp(config);

// Graceful shutdown: Ctrl+C sends SIGINT, Docker/ECS send SIGTERM.
// close() stops new connections and lets requests in progress finish.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    fastifyApp.log.info({ signal }, "Shutting down");
    fastifyApp.close().then(
      () => process.exit(0),
      (error: unknown) => {
        fastifyApp.log.error(error, "Shutdown failed");
        process.exit(1);
      },
    );
  });
}

try {
  await fastifyApp.listen({ host: config.HOST, port: config.PORT });
} catch (error) {
  fastifyApp.log.error(error, "Server failed to start");
  process.exit(1);
}
