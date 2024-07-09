import { describe, expect, it } from "vitest";
import { generateQR } from './qrCode';

describe("generateQR", () => {
  it("should generate a QR code from the input URL", async () => {
    const url = "https://example.com";
    const qrCode = await generateQR(url);

    expect(qrCode).toBeDefined();
    expect(qrCode).toMatch(/^data:image\/png;base64,/);
  });
});
