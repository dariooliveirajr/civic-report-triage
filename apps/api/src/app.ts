import Fastify, { type FastifyInstance } from "fastify";
import type { Config } from "./config.js";
import { healthRoutes } from "./routes/health.js";

/**
 * Builds the Fastify app without starting it. server.ts calls listen();
 * tests use fastifyApp.inject() instead, so no port is opened.
 */
export function buildApp(config: Config): FastifyInstance {
  const fastifyApp = Fastify({ logger: { level: config.LOG_LEVEL } });
  fastifyApp.register(healthRoutes);
  return fastifyApp;
}
