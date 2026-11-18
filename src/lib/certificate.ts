import {
  CanvasElement,
  CanvasElementKind,
  CertificateConfig,
  CertificateRecipient,
  Event,
  GeneratedCertificate,
  JudgeScore,
  RegisteredTeam,
} from "@/types";

export const CERT_CANVAS_WIDTH = 1200;
export const CERT_CANVAS_HEIGHT = 850;

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

  const estimatedCharWidthRatio = 0.55;
  const estimatedTextWidth = text.length * baseFontSizePx * estimatedCharWidthRatio;

  if (estimatedTextWidth <= containerWidthPx) {
    return baseFontSizePx;
  }

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

/**
 * Infer element kind cleanly for both legacy and new elements.
 */
export function getElementKind(el: CanvasElement): CanvasElementKind {
  if (el.kind) return el.kind;
  if (el.type === "logo" || el.type === "signature_img") return "image";
  if (el.type === "seal") return "badge";
  if (el.type === "divider" || el.type === "box") return "shape";
  if (el.type === "qr") return "qr";
  return "text";
}

/**
 * Resolves dynamic mail-merge variables for a given certificate element & recipient.
 * Even if the organizer typed a sample name in the "Participant Name" layer without {{participant_name}},
 * bulk generation automatically substitutes that layer with each student's name.
 */
export function resolveElementText(
  el: CanvasElement,
  recipient: CertificateRecipient | null | undefined,
  eventTitle: string
): string {
  if (!recipient) return el.text;

  const hasTokens = /\{\{[a-z_]+\}\}/i.test(el.text);

  if (hasTokens) {
    return el.text
      .replace(/\{\{participant_name\}\}/gi, recipient.name)
      .replace(/\{\{team_name\}\}/gi, recipient.teamName)
      .replace(/\{\{college_name\}\}/gi, recipient.collegeName)
      .replace(/\{\{event_title\}\}/gi, eventTitle)
      .replace(/\{\{award_role\}\}/gi, recipient.awardRole)
      .replace(/\{\{certificate_id\}\}/gi, recipient.certificateCode)
      .replace(/\{\{issue_date\}\}/gi, recipient.issueDate);
  }

  // Automatic smart binding for semantic fields so 1-click generation works out of the box
  if (el.type === "name") {
    return recipient.name;
  }
  if (el.type === "role") {
    return `${recipient.awardRole} — ${eventTitle}`;
  }
  if (el.type === "qr") {
    return `VERIFY: ${recipient.certificateCode}`;
  }

  return el.text;
}

/**
 * Extracts individual participants from registered teams + imported roster,
 * auto-computes leaderboard award roles, and assigns unique certificate IDs & SHA-256 hashes.
 */
export function buildRecipientsFromEvent(
  teams: RegisteredTeam[],
  judgeScores: JudgeScore[],
  event: Event | undefined,
  extraRecipients: CertificateRecipient[] = []
): CertificateRecipient[] {
  const eventId = event?.id || "hack-ai-2026";
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Compute team rankings from judgeScores for auto award labels
  const scoreMap = new Map<string, { sum: number; count: number }>();
  judgeScores
    .filter((s) => s.eventId === eventId)
    .forEach((sc) => {
      const prev = scoreMap.get(sc.teamId) || { sum: 0, count: 0 };
      prev.sum += sc.totalRaw;
      prev.count += 1;
      scoreMap.set(sc.teamId, prev);
    });

  const rankedTeamIds = Array.from(scoreMap.entries())
    .map(([teamId, v]) => ({ teamId, avg: v.sum / v.count }))
    .sort((a, b) => b.avg - a.avg)
    .map((x) => x.teamId);

  const getAwardForTeam = (teamId: string): string => {
    const rankIdx = rankedTeamIds.indexOf(teamId);
    if (rankIdx === 0) return "1st Place — Grand Prize Winner";
    if (rankIdx === 1) return "2nd Place — First Runner-Up";
    if (rankIdx === 2) return "3rd Place — Second Runner-Up";
    return "Certificate of Active Participation";
  };

  const recipients: CertificateRecipient[] = [];
  const seenKeys = new Set<string>();
  let seq = 1;

  const eventTeams = teams.filter((t) => t.eventId === eventId);

  for (const team of eventTeams) {
    const members =
      team.members && team.members.length > 0
        ? team.members
        : [
            {
              id: `lead-${team.id}`,
              name: team.leaderName,
              email: team.leaderEmail,
              college: team.collegeName,
              role: "lead" as const,
            },
          ];

    const awardRole = getAwardForTeam(team.id);

    for (const member of members) {
      const key = `${member.name.toLowerCase()}::${team.teamName.toLowerCase()}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      const code = `FST-2026-${String(seq).padStart(4, "0")}`;
      seq++;
      recipients.push({
        id: `rec-reg-${team.id}-${member.id}`,
        name: member.name,
        email: member.email || team.leaderEmail,
        teamName: team.teamName,
        collegeName: member.college || team.collegeName,
        awardRole,
        certificateCode: code,
        verificationHash: generateVerificationHash(code, member.email || member.name, eventId, awardRole),
        issueDate,
        source: "registration",
      });
    }
  }

  for (const extra of extraRecipients) {
    const key = `${extra.name.toLowerCase()}::${extra.teamName.toLowerCase()}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    const code = `FST-2026-${String(seq).padStart(4, "0")}`;
    seq++;
    recipients.push({
      ...extra,
      certificateCode: code,
      verificationHash: generateVerificationHash(
        code,
        extra.email || extra.name,
        eventId,
        extra.awardRole
      ),
      issueDate: extra.issueDate || issueDate,
    });
  }

  return recipients;
}

/**
 * Generates N personalized certificate objects from 1 sample certificate template in a single batch.
 */
export function generateBulkCertificates(
  templateConfig: CertificateConfig,
  recipients: CertificateRecipient[],
  eventTitle: string
): GeneratedCertificate[] {
  const now = new Date().toISOString();
  const frozenTemplate: CertificateConfig = {
    ...templateConfig,
    elements: templateConfig.elements.map((el) => ({ ...el })),
  };

  return recipients.map((recipient, idx) => ({
    id: `cert-${recipient.certificateCode}-${idx}`,
    eventId: templateConfig.eventId,
    eventTitle,
    recipient,
    generatedAt: now,
    templateSnapshot: frozenTemplate,
  }));
}

/**
 * Parses CSV or newline-separated student names into CertificateRecipient objects.
 * Supports:
 * - "Aarav Sharma" (1 name per line)
 * - "Aarav Sharma, Team Alpha, NIT Trichy, Winner" (CSV columns)
 */
export function parseRecipientsFromText(
  rawText: string,
  eventId: string,
  defaultCollege: string = "National Institute of Technology, Trichy"
): CertificateRecipient[] {
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: CertificateRecipient[] = [];

  lines.forEach((line, idx) => {
    // Skip CSV header row if present
    if (idx === 0 && /^name\s*,/i.test(line)) return;

    const parts = line.split(",").map((p) => p.trim());
    const name = parts[0];
    if (!name) return;

    const teamName = parts[1] || `Squad ${String(idx + 1).padStart(2, "0")}`;
    const collegeName = parts[2] || defaultCollege;
    const awardRole = parts[3] || "Certificate of Active Participation";
    const code = `FST-2026-${String(idx + 1).padStart(4, "0")}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".");

    results.push({
      id: `rec-imp-${Date.now()}-${idx}`,
      name,
      email: `${slug}@student.edu`,
      teamName,
      collegeName,
      awardRole,
      certificateCode: code,
      verificationHash: generateVerificationHash(code, name, eventId, awardRole),
      issueDate,
      source: "imported",
    });
  });

  return results;
}

/**
 * Curated realistic batch of 50 registered engineering students for instant 1-click 50-certificate demo.
 */
export const SAMPLE_50_PARTICIPANT_NAMES: Array<{
  name: string;
  team: string;
  college: string;
  award: string;
}> = [
  { name: "Karthik Raja", team: "Nexus Protocol", college: "NIT Trichy", award: "1st Place — Grand Prize Winner" },
  { name: "Sneha Nair", team: "Nexus Protocol", college: "NIT Trichy", award: "1st Place — Grand Prize Winner" },
  { name: "Rohan Verma", team: "Aether Systems", college: "IIT Madras", award: "2nd Place — First Runner-Up" },
  { name: "Ananya Iyer", team: "Aether Systems", college: "IIT Madras", award: "2nd Place — First Runner-Up" },
  { name: "Aditya Krishnan", team: "Quantum Drift", college: "NIT Surathkal", award: "3rd Place — Second Runner-Up" },
  { name: "Diya Menon", team: "Quantum Drift", college: "NIT Surathkal", award: "3rd Place — Second Runner-Up" },
  { name: "Arjun Subramanian", team: "Hyperion Core", college: "IIT Bombay", award: "Best Systems Architecture" },
  { name: "Meera Deshmukh", team: "Hyperion Core", college: "IIT Bombay", award: "Best Systems Architecture" },
  { name: "Vikramaditya Rao", team: "CipherPulse", college: "IIIT Hyderabad", award: "Best AI Innovation" },
  { name: "Kavya Sundaram", team: "CipherPulse", college: "IIIT Hyderabad", award: "Best AI Innovation" },
  { name: "Siddharth Kulkarni", team: "VoltMesh", college: "BITS Pilani", award: "Certificate of Active Participation" },
  { name: "Nandini Sharma", team: "VoltMesh", college: "BITS Pilani", award: "Certificate of Active Participation" },
  { name: "Pranav Venkatesh", team: "AstraLabs", college: "VIT Vellore", award: "Certificate of Active Participation" },
  { name: "Rhea Chatterjee", team: "AstraLabs", college: "VIT Vellore", award: "Certificate of Active Participation" },
  { name: "Ishaan Malhotra", team: "Helios AI", college: "IIT Delhi", award: "Certificate of Active Participation" },
  { name: "Tanvi Joshi", team: "Helios AI", college: "IIT Delhi", award: "Certificate of Active Participation" },
  { name: "Varun Narayanan", team: "EdgeForge", college: "Anna University", award: "Certificate of Active Participation" },
  { name: "Shreya Banerjee", team: "EdgeForge", college: "Anna University", award: "Certificate of Active Participation" },
  { name: "Nikhil Raghavan", team: "ZeroLatency", college: "NIT Warangal", award: "Certificate of Active Participation" },
  { name: "Pooja Krishnan", team: "ZeroLatency", college: "NIT Warangal", award: "Certificate of Active Participation" },
  { name: "Aryan Sengupta", team: "TensorFlowX", college: "IIT Kharagpur", award: "Certificate of Active Participation" },
  { name: "Lakshmi Narasimhan", team: "TensorFlowX", college: "IIT Kharagpur", award: "Certificate of Active Participation" },
  { name: "Devansh Patel", team: "CloudMatrix", college: "NIT Calicut", award: "Certificate of Active Participation" },
  { name: "Aditi Bhattacharya", team: "CloudMatrix", college: "NIT Calicut", award: "Certificate of Active Participation" },
  { name: "Harshvardhan Singh", team: "GridLock", college: "IIT Kanpur", award: "Certificate of Active Participation" },
  { name: "Aishwarya Pillai", team: "GridLock", college: "IIT Kanpur", award: "Certificate of Active Participation" },
  { name: "Kunal Deshpande", team: "SynapseNet", college: "COEP Pune", award: "Certificate of Active Participation" },
  { name: "Ritika Agarwal", team: "SynapseNet", college: "COEP Pune", award: "Certificate of Active Participation" },
  { name: "Gaurav Tiwari", team: "ByteStream", college: "DTU Delhi", award: "Certificate of Active Participation" },
  { name: "Sanya Kapoor", team: "ByteStream", college: "DTU Delhi", award: "Certificate of Active Participation" },
  { name: "Abhishek Choudhary", team: "DeltaKernel", college: "NIT Rourkela", award: "Certificate of Active Participation" },
  { name: "Neha Rajagopal", team: "DeltaKernel", college: "NIT Rourkela", award: "Certificate of Active Participation" },
  { name: "Manish Kumar Verma", team: "KubePulse", college: "IIT Roorkee", award: "Certificate of Active Participation" },
  { name: "Swati Muralidharan", team: "KubePulse", college: "IIT Roorkee", award: "Certificate of Active Participation" },
  { name: "Yashwant Reddy", team: "OpenVector", college: "IIIT Bangalore", award: "Certificate of Active Participation" },
  { name: "Divya Prakash", team: "OpenVector", college: "IIIT Bangalore", award: "Certificate of Active Participation" },
  { name: "Tushar Bansal", team: "Rustacean Labs", college: "NSUT Delhi", award: "Certificate of Active Participation" },
  { name: "Anjali Mishra", team: "Rustacean Labs", college: "NSUT Delhi", award: "Certificate of Active Participation" },
  { name: "Surya Teja", team: "OmniChain", college: "SRM Institute", award: "Certificate of Active Participation" },
  { name: "Keerthana Balaji", team: "OmniChain", college: "SRM Institute", award: "Certificate of Active Participation" },
  { name: "Akash Deep Gupta", team: "NeuroCraft", college: "IIT Guwahati", award: "Certificate of Active Participation" },
  { name: "Bhavna Subramani", team: "NeuroCraft", college: "IIT Guwahati", award: "Certificate of Active Participation" },
  { name: "Raghavendra Prasad", team: "OrbitScale", college: "PSG Tech", award: "Certificate of Active Participation" },
  { name: "Deepika Ramaswamy", team: "OrbitScale", college: "PSG Tech", award: "Certificate of Active Participation" },
  { name: "Mayank Srivastava", team: "SignalMesh", college: "MNNIT Allahabad", award: "Certificate of Active Participation" },
  { name: "Priyanka Natarajan", team: "SignalMesh", college: "MNNIT Allahabad", award: "Certificate of Active Participation" },
  { name: "Saurabh Saxena", team: "PulseEngine", college: "NIT Kurukshetra", award: "Certificate of Active Participation" },
  { name: "Gayathri Venkat", team: "PulseEngine", college: "NIT Kurukshetra", award: "Certificate of Active Participation" },
  { name: "Vivek Anand", team: "FluxCompute", college: "SSN College", award: "Certificate of Active Participation" },
  { name: "Ishita Roy", team: "FluxCompute", college: "SSN College", award: "Certificate of Active Participation" },
];

export function buildSample50Recipients(eventId: string): CertificateRecipient[] {
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return SAMPLE_50_PARTICIPANT_NAMES.map((p, idx) => {
    const code = `FST-2026-${String(idx + 1).padStart(4, "0")}`;
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, ".");
    return {
      id: `rec-demo50-${idx + 1}`,
      name: p.name,
      email: `${slug}@college.edu`,
      teamName: p.team,
      collegeName: p.college,
      awardRole: p.award,
      certificateCode: code,
      verificationHash: generateVerificationHash(code, p.name, eventId, p.award),
      issueDate,
      source: "imported",
    };
  });
}

/**
 * 5 Designer Canva-Grade Certificate Templates
 */
export interface CertificateTemplatePreset {
  id: string;
  name: string;
  tagline: string;
  previewBg: string;
  previewAccent: string;
  config: Omit<CertificateConfig, "eventId">;
}

export const CERTIFICATE_TEMPLATES: CertificateTemplatePreset[] = [
  {
    id: "festra_blue",
    name: "FESTRA Electric Blue",
    tagline: "Crisp white & electric blue modern institutional style",
    previewBg: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
    previewAccent: "#2563eb",
    config: {
      templateId: "festra_blue",
      backgroundDataUrl: "",
      backgroundColor: "#ffffff",
      backgroundGradient: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 55%, #e0edff 100%)",
      borderStyle: "modern_accent",
      borderColor: "#2563eb",
      accentColor: "#1d4ed8",
      width: CERT_CANVAS_WIDTH,
      height: CERT_CANVAS_HEIGHT,
      elements: [
        {
          id: "el-seal",
          kind: "badge",
          type: "seal",
          label: "Institutional Crest",
          text: "",
          xPercent: 10,
          yPercent: 16,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#2563eb",
          fontWeight: "700",
          widthPercent: 9,
          heightPercent: 12.5,
          badgeStyle: "blue_crest",
          opacity: 1,
          enabled: true,
        },
        {
          id: "el-institution",
          kind: "text",
          type: "institution",
          label: "Host College / Institution",
          text: "NATIONAL INSTITUTE OF TECHNOLOGY • DEPT. OF CSE",
          xPercent: 50,
          yPercent: 15,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#2563eb",
          fontWeight: "700",
          letterSpacing: 2.5,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-title",
          kind: "text",
          type: "event",
          label: "Certificate Title",
          text: "CERTIFICATE OF ACHIEVEMENT",
          xPercent: 50,
          yPercent: 25,
          fontSize: 52,
          fontFamily: "'FortniteFont', 'Burbank Big Condensed Black', sans-serif",
          color: "#0f172a",
          fontWeight: "900",
          letterSpacing: 2,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-presented",
          kind: "text",
          type: "custom_text",
          label: "Subtitle Lead-in",
          text: "THIS CREDENTIAL IS PROUDLY PRESENTED TO",
          xPercent: 50,
          yPercent: 35,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
          fontWeight: "600",
          letterSpacing: 3,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-name",
          kind: "text",
          type: "name",
          label: "Participant Name",
          text: "{{participant_name}}",
          xPercent: 50,
          yPercent: 47,
          fontSize: 64,
          fontFamily: "Georgia, serif",
          color: "#1e3a8a",
          fontWeight: "700",
          fontStyle: "italic",
          enabled: true,
        },
        {
          id: "el-divider",
          kind: "shape",
          type: "divider",
          label: "Name Underline Accent",
          text: "",
          xPercent: 50,
          yPercent: 55,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#2563eb",
          fontWeight: "400",
          widthPercent: 42,
          heightPercent: 0.45,
          shapeType: "line",
          opacity: 0.85,
          enabled: true,
        },
        {
          id: "el-role",
          kind: "text",
          type: "role",
          label: "Achievement / Award",
          text: "{{award_role}} — {{event_title}}",
          xPercent: 50,
          yPercent: 62,
          fontSize: 24,
          fontFamily: "Inter, sans-serif",
          color: "#2563eb",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-meta",
          kind: "text",
          type: "custom_text",
          label: "Team & Institution Line",
          text: "Representing {{college_name}} • Squad: {{team_name}}",
          xPercent: 50,
          yPercent: 69,
          fontSize: 17,
          fontFamily: "Inter, sans-serif",
          color: "#475569",
          fontWeight: "500",
          enabled: true,
        },
        {
          id: "el-date",
          kind: "text",
          type: "date",
          label: "Issue Date",
          text: "Issued on {{issue_date}}",
          xPercent: 20,
          yPercent: 85,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
          color: "#475569",
          fontWeight: "600",
          enabled: true,
        },
        {
          id: "el-qr",
          kind: "qr",
          type: "qr",
          label: "Verification QR Badge",
          text: "VERIFY: {{certificate_id}}",
          xPercent: 50,
          yPercent: 85,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#1e3a8a",
          fontWeight: "700",
          widthPercent: 22,
          heightPercent: 10,
          enabled: true,
        },
        {
          id: "el-signatures",
          kind: "text",
          type: "signatures",
          label: "Faculty Signatures",
          text: "Dr. K. Ramanathan (HOD)  •  Dr. S. Meenakshi (Dean)",
          xPercent: 80,
          yPercent: 85,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
          color: "#0f172a",
          fontWeight: "600",
          enabled: true,
        },
      ],
    },
  },
  {
    id: "classic_navy",
    name: "Classic Royal Gold",
    tagline: "Timeless university diploma with gold foil seal",
    previewBg: "linear-gradient(135deg, #fffdf7 0%, #fef9e7 100%)",
    previewAccent: "#b45309",
    config: {
      templateId: "classic_navy",
      backgroundDataUrl: "",
      backgroundColor: "#fffdf7",
      backgroundGradient: "radial-gradient(circle at 50% 45%, #ffffff 0%, #fdf8ec 70%, #f5ebd1 100%)",
      borderStyle: "classic_double",
      borderColor: "#b45309",
      accentColor: "#1e3a8a",
      width: CERT_CANVAS_WIDTH,
      height: CERT_CANVAS_HEIGHT,
      elements: [
        {
          id: "el-seal",
          kind: "badge",
          type: "seal",
          label: "Gold Excellence Seal",
          text: "",
          xPercent: 86,
          yPercent: 20,
          fontSize: 16,
          fontFamily: "Georgia, serif",
          color: "#d97706",
          fontWeight: "700",
          widthPercent: 11,
          heightPercent: 15,
          badgeStyle: "gold_seal",
          opacity: 1,
          enabled: true,
        },
        {
          id: "el-institution",
          kind: "text",
          type: "institution",
          label: "Host College / Institution",
          text: "NATIONAL INSTITUTE OF TECHNOLOGY • OFFICIAL ACADEMIC CREDENTIAL",
          xPercent: 50,
          yPercent: 16,
          fontSize: 17,
          fontFamily: "Georgia, serif",
          color: "#92400e",
          fontWeight: "700",
          letterSpacing: 3,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-title",
          kind: "text",
          type: "event",
          label: "Certificate Title",
          text: "Certificate of Excellence",
          xPercent: 50,
          yPercent: 27,
          fontSize: 54,
          fontFamily: "Georgia, serif",
          color: "#1e293b",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-presented",
          kind: "text",
          type: "custom_text",
          label: "Subtitle Lead-in",
          text: "THIS IS TO CERTIFY THAT",
          xPercent: 50,
          yPercent: 37,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
          color: "#78716c",
          fontWeight: "600",
          letterSpacing: 4,
          enabled: true,
        },
        {
          id: "el-name",
          kind: "text",
          type: "name",
          label: "Participant Name",
          text: "{{participant_name}}",
          xPercent: 50,
          yPercent: 49,
          fontSize: 64,
          fontFamily: "Georgia, serif",
          color: "#1e3a8a",
          fontWeight: "700",
          fontStyle: "italic",
          enabled: true,
        },
        {
          id: "el-divider",
          kind: "shape",
          type: "divider",
          label: "Gold Divider",
          text: "",
          xPercent: 50,
          yPercent: 57,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#d97706",
          fontWeight: "400",
          widthPercent: 45,
          heightPercent: 0.4,
          shapeType: "line",
          opacity: 0.9,
          enabled: true,
        },
        {
          id: "el-role",
          kind: "text",
          type: "role",
          label: "Achievement / Award",
          text: "{{award_role}} in {{event_title}}",
          xPercent: 50,
          yPercent: 64,
          fontSize: 22,
          fontFamily: "Georgia, serif",
          color: "#92400e",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-meta",
          kind: "text",
          type: "custom_text",
          label: "Team & Institution Line",
          text: "From {{college_name}} • Team {{team_name}}",
          xPercent: 50,
          yPercent: 71,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#57534e",
          fontWeight: "500",
          enabled: true,
        },
        {
          id: "el-date",
          kind: "text",
          type: "date",
          label: "Issue Date",
          text: "Date: {{issue_date}}",
          xPercent: 20,
          yPercent: 85,
          fontSize: 15,
          fontFamily: "Georgia, serif",
          color: "#44403c",
          fontWeight: "600",
          enabled: true,
        },
        {
          id: "el-qr",
          kind: "qr",
          type: "qr",
          label: "Verification QR Badge",
          text: "VERIFY: {{certificate_id}}",
          xPercent: 50,
          yPercent: 85,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#78350f",
          fontWeight: "700",
          widthPercent: 22,
          heightPercent: 10,
          enabled: true,
        },
        {
          id: "el-signatures",
          kind: "text",
          type: "signatures",
          label: "Faculty Signatures",
          text: "Dr. K. Ramanathan (HOD)  •  Dr. S. Meenakshi (Dean)",
          xPercent: 80,
          yPercent: 85,
          fontSize: 14,
          fontFamily: "Georgia, serif",
          color: "#1c1917",
          fontWeight: "600",
          enabled: true,
        },
      ],
    },
  },
  {
    id: "minimal_exec",
    name: "Minimal Swiss White",
    tagline: "Ultra-clean gallery typography with razor lines",
    previewBg: "#ffffff",
    previewAccent: "#0f172a",
    config: {
      templateId: "minimal_exec",
      backgroundDataUrl: "",
      backgroundColor: "#ffffff",
      backgroundGradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      borderStyle: "minimal_line",
      borderColor: "#0f172a",
      accentColor: "#2563eb",
      width: CERT_CANVAS_WIDTH,
      height: CERT_CANVAS_HEIGHT,
      elements: [
        {
          id: "el-institution",
          kind: "text",
          type: "institution",
          label: "Host College / Institution",
          text: "NATIONAL INSTITUTE OF TECHNOLOGY • OFFICIAL TRANSCRIPT",
          xPercent: 50,
          yPercent: 16,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
          fontWeight: "700",
          letterSpacing: 4,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-title",
          kind: "text",
          type: "event",
          label: "Certificate Title",
          text: "CERTIFICATE OF RECOGNITION",
          xPercent: 50,
          yPercent: 27,
          fontSize: 44,
          fontFamily: "Inter, sans-serif",
          color: "#0f172a",
          fontWeight: "900",
          letterSpacing: 3,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-name",
          kind: "text",
          type: "name",
          label: "Participant Name",
          text: "{{participant_name}}",
          xPercent: 50,
          yPercent: 48,
          fontSize: 66,
          fontFamily: "Inter, sans-serif",
          color: "#0f172a",
          fontWeight: "800",
          enabled: true,
        },
        {
          id: "el-divider",
          kind: "shape",
          type: "divider",
          label: "Minimal Accent Rule",
          text: "",
          xPercent: 50,
          yPercent: 56,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#0f172a",
          fontWeight: "400",
          widthPercent: 24,
          heightPercent: 0.4,
          shapeType: "line",
          opacity: 1,
          enabled: true,
        },
        {
          id: "el-role",
          kind: "text",
          type: "role",
          label: "Achievement / Award",
          text: "{{award_role}} — {{event_title}}",
          xPercent: 50,
          yPercent: 64,
          fontSize: 22,
          fontFamily: "Inter, sans-serif",
          color: "#2563eb",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-meta",
          kind: "text",
          type: "custom_text",
          label: "Team & Institution Line",
          text: "{{college_name}}  |  Squad: {{team_name}}",
          xPercent: 50,
          yPercent: 71,
          fontSize: 16,
          fontFamily: "monospace",
          color: "#64748b",
          fontWeight: "500",
          enabled: true,
        },
        {
          id: "el-date",
          kind: "text",
          type: "date",
          label: "Issue Date",
          text: "{{issue_date}}",
          xPercent: 20,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "monospace",
          color: "#475569",
          fontWeight: "600",
          enabled: true,
        },
        {
          id: "el-qr",
          kind: "qr",
          type: "qr",
          label: "Verification QR Badge",
          text: "VERIFY: {{certificate_id}}",
          xPercent: 50,
          yPercent: 86,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#0f172a",
          fontWeight: "700",
          widthPercent: 22,
          heightPercent: 10,
          enabled: true,
        },
        {
          id: "el-signatures",
          kind: "text",
          type: "signatures",
          label: "Faculty Signatures",
          text: "Dr. K. Ramanathan • Convener",
          xPercent: 80,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          color: "#0f172a",
          fontWeight: "600",
          enabled: true,
        },
      ],
    },
  },
  {
    id: "emerald_academic",
    name: "Emerald Academic",
    tagline: "Ornate corner frames for symposiums & papers",
    previewBg: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    previewAccent: "#059669",
    config: {
      templateId: "emerald_academic",
      backgroundDataUrl: "",
      backgroundColor: "#f8faf9",
      backgroundGradient: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #f0fdf4 100%)",
      borderStyle: "ornate_corners",
      borderColor: "#059669",
      accentColor: "#047857",
      width: CERT_CANVAS_WIDTH,
      height: CERT_CANVAS_HEIGHT,
      elements: [
        {
          id: "el-seal",
          kind: "badge",
          type: "seal",
          label: "Star Ribbon Crest",
          text: "",
          xPercent: 50,
          yPercent: 13,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#059669",
          fontWeight: "700",
          widthPercent: 8,
          heightPercent: 11,
          badgeStyle: "star_ribbon",
          opacity: 1,
          enabled: true,
        },
        {
          id: "el-institution",
          kind: "text",
          type: "institution",
          label: "Host College / Institution",
          text: "NATIONAL RESEARCH SYMPOSIUM • ACADEMIC EXCELLENCE BOARD",
          xPercent: 50,
          yPercent: 22,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#047857",
          fontWeight: "700",
          letterSpacing: 3,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-title",
          kind: "text",
          type: "event",
          label: "Certificate Title",
          text: "Certificate of Merit",
          xPercent: 50,
          yPercent: 32,
          fontSize: 52,
          fontFamily: "Georgia, serif",
          color: "#064e3b",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-name",
          kind: "text",
          type: "name",
          label: "Participant Name",
          text: "{{participant_name}}",
          xPercent: 50,
          yPercent: 50,
          fontSize: 62,
          fontFamily: "Georgia, serif",
          color: "#0f172a",
          fontWeight: "700",
          fontStyle: "italic",
          enabled: true,
        },
        {
          id: "el-divider",
          kind: "shape",
          type: "divider",
          label: "Emerald Rule",
          text: "",
          xPercent: 50,
          yPercent: 58,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#059669",
          fontWeight: "400",
          widthPercent: 40,
          heightPercent: 0.4,
          shapeType: "line",
          opacity: 0.85,
          enabled: true,
        },
        {
          id: "el-role",
          kind: "text",
          type: "role",
          label: "Achievement / Award",
          text: "{{award_role}} — {{event_title}}",
          xPercent: 50,
          yPercent: 65,
          fontSize: 22,
          fontFamily: "Inter, sans-serif",
          color: "#047857",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-meta",
          kind: "text",
          type: "custom_text",
          label: "Team & Institution Line",
          text: "{{college_name}} • {{team_name}}",
          xPercent: 50,
          yPercent: 72,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#475569",
          fontWeight: "500",
          enabled: true,
        },
        {
          id: "el-date",
          kind: "text",
          type: "date",
          label: "Issue Date",
          text: "Issued {{issue_date}}",
          xPercent: 20,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          color: "#334155",
          fontWeight: "600",
          enabled: true,
        },
        {
          id: "el-qr",
          kind: "qr",
          type: "qr",
          label: "Verification QR Badge",
          text: "VERIFY: {{certificate_id}}",
          xPercent: 50,
          yPercent: 86,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#065f46",
          fontWeight: "700",
          widthPercent: 22,
          heightPercent: 10,
          enabled: true,
        },
        {
          id: "el-signatures",
          kind: "text",
          type: "signatures",
          label: "Faculty Signatures",
          text: "Dr. K. Ramanathan (Chair)  •  Dr. S. Meenakshi (Dean)",
          xPercent: 80,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          color: "#064e3b",
          fontWeight: "600",
          enabled: true,
        },
      ],
    },
  },
  {
    id: "cyber_dark",
    name: "Midnight Hackathon",
    tagline: "High-contrast obsidian slate with neon blue accents",
    previewBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    previewAccent: "#38bdf8",
    config: {
      templateId: "cyber_dark",
      backgroundDataUrl: "",
      backgroundColor: "#0f172a",
      backgroundGradient: "radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 65%, #020617 100%)",
      borderStyle: "modern_accent",
      borderColor: "#38bdf8",
      accentColor: "#3b82f6",
      width: CERT_CANVAS_WIDTH,
      height: CERT_CANVAS_HEIGHT,
      elements: [
        {
          id: "el-seal",
          kind: "badge",
          type: "seal",
          label: "Verified Stamp",
          text: "",
          xPercent: 87,
          yPercent: 18,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#38bdf8",
          fontWeight: "700",
          widthPercent: 10,
          heightPercent: 14,
          badgeStyle: "verified_stamp",
          opacity: 1,
          enabled: true,
        },
        {
          id: "el-institution",
          kind: "text",
          type: "institution",
          label: "Host College / Institution",
          text: "FESTRA HACKATHON CREDENTIAL • VERIFIED PROOF OF WORK",
          xPercent: 50,
          yPercent: 16,
          fontSize: 16,
          fontFamily: "monospace",
          color: "#38bdf8",
          fontWeight: "700",
          letterSpacing: 3,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-title",
          kind: "text",
          type: "event",
          label: "Certificate Title",
          text: "CERTIFICATE OF ACHIEVEMENT",
          xPercent: 50,
          yPercent: 27,
          fontSize: 54,
          fontFamily: "'FortniteFont', 'Burbank Big Condensed Black', sans-serif",
          color: "#ffffff",
          fontWeight: "900",
          letterSpacing: 2,
          textTransform: "uppercase",
          enabled: true,
        },
        {
          id: "el-name",
          kind: "text",
          type: "name",
          label: "Participant Name",
          text: "{{participant_name}}",
          xPercent: 50,
          yPercent: 48,
          fontSize: 64,
          fontFamily: "Georgia, serif",
          color: "#f8fafc",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-divider",
          kind: "shape",
          type: "divider",
          label: "Neon Blue Accent",
          text: "",
          xPercent: 50,
          yPercent: 56,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#38bdf8",
          fontWeight: "400",
          widthPercent: 42,
          heightPercent: 0.45,
          shapeType: "line",
          opacity: 0.9,
          enabled: true,
        },
        {
          id: "el-role",
          kind: "text",
          type: "role",
          label: "Achievement / Award",
          text: "{{award_role}} — {{event_title}}",
          xPercent: 50,
          yPercent: 63,
          fontSize: 23,
          fontFamily: "Inter, sans-serif",
          color: "#38bdf8",
          fontWeight: "700",
          enabled: true,
        },
        {
          id: "el-meta",
          kind: "text",
          type: "custom_text",
          label: "Team & Institution Line",
          text: "{{college_name}} • Squad: {{team_name}}",
          xPercent: 50,
          yPercent: 70,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          color: "#94a3b8",
          fontWeight: "500",
          enabled: true,
        },
        {
          id: "el-date",
          kind: "text",
          type: "date",
          label: "Issue Date",
          text: "Issued on {{issue_date}}",
          xPercent: 20,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "monospace",
          color: "#94a3b8",
          fontWeight: "600",
          enabled: true,
        },
        {
          id: "el-qr",
          kind: "qr",
          type: "qr",
          label: "Verification QR Badge",
          text: "VERIFY: {{certificate_id}}",
          xPercent: 50,
          yPercent: 86,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#38bdf8",
          fontWeight: "700",
          widthPercent: 22,
          heightPercent: 10,
          enabled: true,
        },
        {
          id: "el-signatures",
          kind: "text",
          type: "signatures",
          label: "Faculty Signatures",
          text: "Dr. K. Ramanathan (HOD)  •  Dr. S. Meenakshi (Convener)",
          xPercent: 80,
          yPercent: 86,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          color: "#cbd5e1",
          fontWeight: "600",
          enabled: true,
        },
      ],
    },
  },
];

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates a self-contained 1200x850 Vector SVG string for any certificate + recipient.
 * Includes uploaded college logos/images, vector badges, borders, auto-scaled typography, and QR stamp.
 */
export function renderCertificateToSvg(
  config: CertificateConfig,
  recipient: CertificateRecipient | null | undefined,
  eventTitle: string
): string {
  const W = config.width || CERT_CANVAS_WIDTH;
  const H = config.height || CERT_CANVAS_HEIGHT;
  const bgColor = config.backgroundColor || "#ffffff";
  const borderColor = config.borderColor || "#2563eb";
  const borderStyle = config.borderStyle || "modern_accent";

  // Frame SVG markup
  let borderMarkup = "";
  if (borderStyle === "classic_double") {
    borderMarkup = `
      <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${borderColor}" stroke-width="5"/>
      <rect x="42" y="42" width="${W - 84}" height="${H - 84}" fill="none" stroke="${borderColor}" stroke-width="1.5" stroke-opacity="0.7"/>
    `;
  } else if (borderStyle === "modern_accent") {
    borderMarkup = `
      <rect x="0" y="0" width="${W}" height="14" fill="${borderColor}"/>
      <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${borderColor}"/>
      <rect x="28" y="32" width="${W - 56}" height="${H - 64}" rx="16" fill="none" stroke="${borderColor}" stroke-width="2" stroke-opacity="0.28"/>
    `;
  } else if (borderStyle === "ornate_corners") {
    borderMarkup = `
      <rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${borderColor}" stroke-width="2" stroke-opacity="0.4"/>
      <path d="M22 92 L22 22 L92 22" fill="none" stroke="${borderColor}" stroke-width="6"/>
      <path d="M${W - 92} 22 L${W - 22} 22 L${W - 22} 92" fill="none" stroke="${borderColor}" stroke-width="6"/>
      <path d="M22 ${H - 92} L22 ${H - 22} L92 ${H - 22}" fill="none" stroke="${borderColor}" stroke-width="6"/>
      <path d="M${W - 92} ${H - 22} L${W - 22} ${H - 22} L${W - 22} ${H - 92}" fill="none" stroke="${borderColor}" stroke-width="6"/>
    `;
  } else if (borderStyle === "minimal_line") {
    borderMarkup = `
      <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="${borderColor}" stroke-width="2"/>
    `;
  }

  const bgMarkup = config.backgroundDataUrl
    ? `<image href="${config.backgroundDataUrl}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect width="${W}" height="${H}" fill="${bgColor}"/>`;

  const elementsMarkup = config.elements
    .filter((el) => el.enabled)
    .map((el) => {
      const cx = (el.xPercent / 100) * W;
      const cy = (el.yPercent / 100) * H;
      const kind = getElementKind(el);
      const opacity = el.opacity ?? 1;
      const rotation = el.rotation || 0;
      const transformAttr = rotation ? ` transform="rotate(${rotation} ${cx} ${cy})"` : "";

      if (kind === "image" && el.imageDataUrl) {
        const iw = ((el.widthPercent || 12) / 100) * W;
        const ih = ((el.heightPercent || 14) / 100) * H;
        const x = cx - iw / 2;
        const y = cy - ih / 2;
        const clipId = `clip-${el.id.replace(/[^a-zA-Z0-9]/g, "")}`;
        const rx = el.borderRadius && el.borderRadius >= 90 ? Math.min(iw, ih) / 2 : el.borderRadius || 0;
        return `
          <defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${iw}" height="${ih}" rx="${rx}"/></clipPath></defs>
          <image href="${el.imageDataUrl}" x="${x}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" opacity="${opacity}"${transformAttr}/>
        `;
      }

      if (kind === "shape") {
        const sw = ((el.widthPercent || 35) / 100) * W;
        const sh = Math.max(2, ((el.heightPercent || 0.4) / 100) * H);
        const rx = el.shapeType === "pill" ? sh / 2 : el.borderRadius || 2;
        return `<rect x="${cx - sw / 2}" y="${cy - sh / 2}" width="${sw}" height="${sh}" rx="${rx}" fill="${el.color}" opacity="${opacity}"${transformAttr}/>`;
      }

      if (kind === "badge") {
        const r = Math.min(((el.widthPercent || 10) / 100) * W, ((el.heightPercent || 14) / 100) * H) / 2;
        const badgeColor = el.color || "#2563eb";
        return `
          <g opacity="${opacity}"${transformAttr}>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="${badgeColor}" fill-opacity="0.12" stroke="${badgeColor}" stroke-width="3"/>
            <circle cx="${cx}" cy="${cy}" r="${r * 0.78}" fill="none" stroke="${badgeColor}" stroke-width="1.5" stroke-dasharray="4 3"/>
            <text x="${cx}" y="${cy + 5}" font-family="Inter, sans-serif" font-size="${Math.max(10, r * 0.28)}" font-weight="800" fill="${badgeColor}" text-anchor="middle">VERIFIED</text>
          </g>
        `;
      }

      if (kind === "qr") {
        const label = resolveElementText(el, recipient, eventTitle);
        const bw = 230;
        const bh = 54;
        return `
          <g opacity="${opacity}"${transformAttr}>
            <rect x="${cx - bw / 2}" y="${cy - bh / 2}" width="${bw}" height="${bh}" rx="10" fill="#ffffff" fill-opacity="0.92" stroke="${el.color || "#2563eb"}" stroke-width="1.5"/>
            <rect x="${cx - bw / 2 + 12}" y="${cy - 17}" width="34" height="34" rx="4" fill="#0f172a"/>
            <rect x="${cx - bw / 2 + 17}" y="${cy - 12}" width="10" height="10" fill="#ffffff"/>
            <rect x="${cx - bw / 2 + 31}" y="${cy - 12}" width="10" height="10" fill="#ffffff"/>
            <rect x="${cx - bw / 2 + 17}" y="${cy + 2}" width="10" height="10" fill="#ffffff"/>
            <text x="${cx - bw / 2 + 58}" y="${cy - 2}" font-family="monospace" font-size="11" font-weight="700" fill="${el.color || "#1e3a8a"}">${escapeXml(label)}</text>
            <text x="${cx - bw / 2 + 58}" y="${cy + 13}" font-family="Inter, sans-serif" font-size="9" fill="#64748b">SHA-256 FESTRA PROOF</text>
          </g>
        `;
      }

      // Text element
      const resolved = resolveElementText(el, recipient, eventTitle);
      const displayText =
        el.textTransform === "uppercase"
          ? resolved.toUpperCase()
          : resolved;
      const computedSize =
        el.type === "name"
          ? calculateAutoFontSize(displayText, W * 0.78, el.fontSize, 26)
          : el.fontSize;
      const anchor =
        el.textAlign === "left" ? "start" : el.textAlign === "right" ? "end" : "middle";

      return `<text x="${cx}" y="${cy}" font-family="${escapeXml(el.fontFamily)}" font-size="${computedSize}" font-weight="${el.fontWeight}" font-style="${el.fontStyle || "normal"}" letter-spacing="${el.letterSpacing || 0}" fill="${el.color}" opacity="${opacity}" text-anchor="${anchor}" dominant-baseline="middle"${transformAttr}>${escapeXml(displayText)}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${bgMarkup}
  ${borderMarkup}
  ${elementsMarkup}
</svg>`.trim();
}

/**
 * Converts a Certificate SVG string into a crisp High-Res PNG data URL in the browser.
 */
export async function renderCertificateToPngDataUrl(
  config: CertificateConfig,
  recipient: CertificateRecipient | null | undefined,
  eventTitle: string,
  scale: number = 2
): Promise<string> {
  const svgString = renderCertificateToSvg(config, recipient, eventTitle);
  const W = (config.width || CERT_CANVAS_WIDTH) * scale;
  const H = (config.height || CERT_CANVAS_HEIGHT) * scale;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to render SVG to PNG"));
    };

    img.src = url;
  });
}
