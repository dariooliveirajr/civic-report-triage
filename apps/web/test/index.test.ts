import { describe, expect, it } from "vitest";
import { appName } from "../src/index";

describe("web workspace", () => {
  it("exports its app name", () => {
    expect(appName).toBe("civic-report-triage-web");
  });
});
