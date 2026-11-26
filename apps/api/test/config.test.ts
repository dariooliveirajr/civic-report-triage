import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("uses defaults when variables are missing", () => {
    expect(loadConfig({})).toEqual({ PORT: 3000, LOG_LEVEL: "info" });
  });

  it("reads and coerces valid values", () => {
    expect(loadConfig({ PORT: "8080", LOG_LEVEL: "debug" })).toEqual({
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
