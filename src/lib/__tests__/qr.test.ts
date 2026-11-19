import { describe, it, expect } from "vitest";
import QRCode from "qrcode";

describe("Event Registration QR Generation", () => {
  const origin = "https://festra.campus.edu";

  it("should generate valid PNG data URL for general fest registration", async () => {
    const generalUrl = `${origin}/?view=portal`;
    const dataUrl = await QRCode.toDataURL(generalUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "H",
    });

    expect(dataUrl).toBeDefined();
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    expect(dataUrl.length).toBeGreaterThan(100);
  });

  it("should generate valid PNG data URL for specific event track deep-link", async () => {
    const eventId = "hack-ai-2026";
    const trackUrl = `${origin}/?view=portal&event=${eventId}`;
    const dataUrl = await QRCode.toDataURL(trackUrl, {
      width: 800,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    expect(dataUrl).toBeDefined();
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("should generate valid SVG vector string for banner printing", async () => {
    const eventId = "paper-symposium-2026";
    const trackUrl = `${origin}/?view=portal&event=${eventId}`;
    const svgString = await QRCode.toString(trackUrl, {
      type: "svg",
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "H",
    });

    expect(svgString).toBeDefined();
    expect(svgString.includes("<svg")).toBe(true);
    expect(svgString.includes("</svg>")).toBe(true);
    expect(svgString.includes("xmlns=\"http://www.w3.org/2000/svg\"")).toBe(true);
  });

  it("should correctly encode and roundtrip URL query parameters", () => {
    const eventId = "hack-ai-2026";
    const targetUrl = `http://localhost:3000/?view=portal&event=${eventId}`;
    const parsed = new URL(targetUrl);

    expect(parsed.searchParams.get("view")).toBe("portal");
    expect(parsed.searchParams.get("event")).toBe("hack-ai-2026");
  });
});
