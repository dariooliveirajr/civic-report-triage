import { describe, expect, it } from "vitest";
import { serviceName } from "../src/index.js";

describe("api workspace", () => {
  it("exports its service name", () => {
    expect(serviceName).toBe("civic-report-triage-api");
  });
});
