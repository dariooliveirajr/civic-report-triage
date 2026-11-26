import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("uses defaults when variables are missing", () => {
    expect(loadConfig({})).toEqual({
      HOST: "0.0.0.0",
      PORT: 3000,
      LOG_LEVEL: "info",
    });
  });

  it("reads and coerces valid values", () => {
    expect(loadConfig({ HOST: "127.0.0.1", PORT: "8080", LOG_LEVEL: "debug" })).toEqual({
      HOST: "127.0.0.1",
      PORT: 8080,
      LOG_LEVEL: "debug",
    });
  });

  it("throws on an invalid PORT", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow(/PORT/);
  });

  it("throws on an unknown LOG_LEVEL", () => {
    expect(() => loadConfig({ LOG_LEVEL: "loud" })).toThrow(/LOG_LEVEL/);
  });
});
