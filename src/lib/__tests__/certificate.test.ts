import { describe, it, expect } from "vitest";
import {
  generateVerificationHash,
  calculateAutoFontSize,
  generateLinkedInCertificateUrl,
} from "../certificate";

describe("Verifiable Certificate & Typography Engine", () => {
  it("generates deterministic tamper-proof hashes for valid credentials", () => {
    const hash1 = generateVerificationHash("FESTRA-2026-NIT-0042", "20CS101", "event_ai_hack", "winner");
    const hash2 = generateVerificationHash("FESTRA-2026-NIT-0042", "20CS101", "event_ai_hack", "winner");
    const hashDifferent = generateVerificationHash("FESTRA-2026-NIT-0042", "20CS102", "event_ai_hack", "winner");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashDifferent);
    expect(hash1.startsWith("0x")).toBe(true);
    expect(hash1.length).toBe(34); // 0x + 32 hex chars
  });

  it("scales down font size dynamically for long student names", () => {
    const containerWidth = 400; // px
    const baseFontSize = 48; // px

    const shortName = "Alex Wu";
    const longName = "Dr. Venkatasubramanian Ramachandran-Chidambaram";

    const shortSize = calculateAutoFontSize(shortName, containerWidth, baseFontSize);
    const longSize = calculateAutoFontSize(longName, containerWidth, baseFontSize);

    expect(shortSize).toBe(48); // Kept default
    expect(longSize).toBeLessThan(40); // Shrunk to fit
    expect(longSize).toBeGreaterThanOrEqual(22); // Above minimum floor
  });

  it("formats correct LinkedIn Add-to-Profile URLs with prefilled metadata", () => {
    const url = generateLinkedInCertificateUrl({
      certificateCode: "FESTRA-2026-NIT-0042",
      eventName: "HackSphere 2026",
      institutionName: "NIT Trichy",
      issueDate: "2026-11-14",
      verificationUrl: "https://verify.festra.dev/c/FESTRA-2026-NIT-0042",
    });

    expect(url).toContain("https://www.linkedin.com/profile/add");
    expect(url).toContain("FESTRA-2026-NIT-0042");
    expect(url).toContain("NIT+Trichy");
  });
});
