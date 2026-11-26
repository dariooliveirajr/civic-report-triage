import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

describe("GET /health", () => {
  let fastifyApp: FastifyInstance;

  afterEach(async () => {
    await fastifyApp.close();
  });

  it("returns status ok", async () => {
    fastifyApp = buildApp({ HOST: "127.0.0.1", PORT: 3000, LOG_LEVEL: "silent" });

    const response = await fastifyApp.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
