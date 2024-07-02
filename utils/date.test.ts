import { describe, expect, it } from "vitest";
import { formatUtcToLocaleTimezone } from "./date";

describe("formatUtcToLocaleTimezone", () => {
  it("should format UTC ISO input value to local timezone", () => {
    const utcDate = "2023-10-01T12:00:00Z";
    const timeZone = "America/Los_Angeles"; // PDT
    const formattedDate = formatUtcToLocaleTimezone(utcDate, timeZone);

    // The expected output will depend on the specified timezone in the test.
    // For example, if the specified timezone is 'America/Los_Angeles', the expected output might be:
    // '2023-10-01' (PDT)
    // Adjust the expected output according to the specified timezone in the test.
    const expectedOutput = new Date(utcDate).toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: undefined,
      minute: undefined,
      second: undefined,
      hour12: false,
      timeZone,
      timeZoneName: undefined,
    }).replace(",", "");

    expect(formattedDate).toBe(expectedOutput);
  });
});
