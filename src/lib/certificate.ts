/**
 * Simple cryptographic-style hash generator for tamper-proof verification strings.
 * Combines recipient metadata with a salt to create verifiable certificate signatures.
 */
export function generateVerificationHash(
  certificateCode: string,
  recipientRoll: string,
  eventId: string,
  role: string
): string {
  const secretSalt = "FESTRA_TAMPER_PROOF_SECURE_VAULT_KEY_2026";
  const data = `${certificateCode}:${recipientRoll.toUpperCase()}:${eventId}:${role}:${secretSalt}`;

  // Simple deterministic 64-char hex hash implementation for edge/browser safety
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57,
    h3 = 0x85ebca6b,
    h4 = 0xc2b2ae35;

  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).padStart(8, "0");
  const hex3 = (h3 >>> 0).toString(16).padStart(8, "0");
  const hex4 = (h4 >>> 0).toString(16).padStart(8, "0");

  return `0x${hex1}${hex2}${hex3}${hex4}`.toLowerCase();
}

/**
 * Calculates optimal font size in pixels to prevent long names from breaking certificate canvas bounds.
 */
export function calculateAutoFontSize(
  text: string,
  containerWidthPx: number,
  baseFontSizePx: number = 48,
  minFontSizePx: number = 22
): number {
  if (!text || text.length === 0) return baseFontSizePx;

  // Approximate character width ratio for clean serif / display fonts (average ~0.55 of font size)
  const estimatedCharWidthRatio = 0.55;
  const estimatedTextWidth = text.length * baseFontSizePx * estimatedCharWidthRatio;

  if (estimatedTextWidth <= containerWidthPx) {
    return baseFontSizePx;
  }

  // Scale down proportionally
  const scaledSize = Math.floor(containerWidthPx / (text.length * estimatedCharWidthRatio));
  return Math.max(minFontSizePx, Math.min(baseFontSizePx, scaledSize));
}

/**
 * Generates an official LinkedIn Add-to-Profile URL.
 */
export function generateLinkedInCertificateUrl(cert: {
  certificateCode: string;
  eventName: string;
  institutionName: string;
  issueDate: string; // YYYY-MM-DD
  verificationUrl: string;
}): string {
  const [year, month] = cert.issueDate.split("-");

  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `${cert.eventName} — Proof of Work & Achievement`,
    organizationName: cert.institutionName,
    issueYear: year || "2026",
    issueMonth: month ? String(parseInt(month, 10)) : "11",
    certUrl: cert.verificationUrl,
    certId: cert.certificateCode,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
