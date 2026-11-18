import { describe, it, expect } from "vitest";
import {
  generateVerificationHash,
  calculateAutoFontSize,
  generateLinkedInCertificateUrl,
  CERTIFICATE_TEMPLATES,
  buildSample50Recipients,
  generateBulkCertificates,
  resolveElementText,
  parseRecipientsFromText,
  renderCertificateToSvg,
} from "../certificate";
import { CanvasElement } from "@/types";

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

  it("generates 50 unique personalized certificates from 1 sample template preserving custom college logo", () => {
    const sample50 = buildSample50Recipients("hack-ai-2026");
    expect(sample50.length).toBe(50);

    const logoElement: CanvasElement = {
      id: "el-custom-logo",
      kind: "image",
      type: "logo",
      label: "College Logo",
      text: "",
      imageDataUrl: "data:image/png;base64,FAKE_LOGO_DATA",
      xPercent: 14,
      yPercent: 16,
      widthPercent: 12,
      heightPercent: 14,
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      color: "#2563eb",
      fontWeight: "600",
      enabled: true,
    };

    const sampleTemplate = {
      eventId: "hack-ai-2026",
      ...CERTIFICATE_TEMPLATES[0].config,
      elements: [...CERTIFICATE_TEMPLATES[0].config.elements, logoElement],
    };

    const generated = generateBulkCertificates(sampleTemplate, sample50, "HackCampus 2026");

    expect(generated.length).toBe(50);
    // Unique certificate codes
    const uniqueCodes = new Set(generated.map((c) => c.recipient.certificateCode));
    expect(uniqueCodes.size).toBe(50);

    // Every generated certificate keeps the uploaded college logo and renders the specific student's name in SVG
    const firstSvg = renderCertificateToSvg(
      generated[0].templateSnapshot,
      generated[0].recipient,
      generated[0].eventTitle
    );
    const fiftiethSvg = renderCertificateToSvg(
      generated[49].templateSnapshot,
      generated[49].recipient,
      generated[49].eventTitle
    );

    expect(firstSvg).toContain("Karthik Raja");
    expect(firstSvg).toContain("FAKE_LOGO_DATA");
    expect(fiftiethSvg).toContain("Ishita Roy");
    expect(fiftiethSvg).toContain("FAKE_LOGO_DATA");
    expect(firstSvg).not.toContain("Ishita Roy");
  });

  it("substitutes both explicit {{tokens}} and smart name fields automatically", () => {
    const recipient = buildSample50Recipients("hack-ai-2026")[0];
    const nameEl: CanvasElement = {
      id: "el-n",
      kind: "text",
      type: "name",
      label: "Participant Name",
      text: "Sample Placeholder Name",
      xPercent: 50,
      yPercent: 50,
      fontSize: 48,
      fontFamily: "Georgia, serif",
      color: "#000000",
      fontWeight: "700",
      enabled: true,
    };
    const tokenEl: CanvasElement = {
      ...nameEl,
      id: "el-t",
      type: "custom_text",
      text: "Presented to {{participant_name}} from {{college_name}} ({{certificate_id}})",
    };

    expect(resolveElementText(nameEl, recipient, "HackCampus 2026")).toBe("Karthik Raja");
    expect(resolveElementText(tokenEl, recipient, "HackCampus 2026")).toBe(
      "Presented to Karthik Raja from NIT Trichy (FST-2026-0001)"
    );
  });

  it("parses pasted student names and CSV rows into certificate recipients", () => {
    const csv = `Name, Team, College, Award
Aarav Sharma, Alpha Squad, IIT Bombay, 1st Place Winner
Priya Nair`;
    const parsed = parseRecipientsFromText(csv, "hack-ai-2026");
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe("Aarav Sharma");
    expect(parsed[0].teamName).toBe("Alpha Squad");
    expect(parsed[0].collegeName).toBe("IIT Bombay");
    expect(parsed[0].awardRole).toBe("1st Place Winner");
    expect(parsed[1].name).toBe("Priya Nair");
  });
});
