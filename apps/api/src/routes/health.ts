import type { FastifyPluginAsync } from "fastify";

/** Liveness check: answers as long as the process can serve requests. */
export const healthRoutes: FastifyPluginAsync = async (fastifyApp) => {
  fastifyApp.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: { status: { type: "string", const: "ok" } },
            required: ["status"],
          },
        },
      },
    },
    async () => ({ status: "ok" }),
  );
};
