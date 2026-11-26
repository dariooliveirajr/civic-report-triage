import * as zod from "zod";

const configSchema = zod.object({
  HOST: zod.string().min(1).default("0.0.0.0"),
  PORT: zod.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: zod
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

export type Config = zod.infer<typeof configSchema>;

/**
 * Reads and validates config from environment variables. Throws with a
 * readable list of the invalid variables, so the server refuses to start
 * on bad config.
 */
export function loadConfig(environment: NodeJS.ProcessEnv = process.env): Config {
  const result = configSchema.safeParse(environment);
  if (!result.success) {
    throw new Error(`Invalid config:\n${zod.prettifyError(result.error)}`);
  }
  return result.data;
}
