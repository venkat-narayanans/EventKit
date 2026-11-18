import { describe, it, expect } from "vitest";
import {
  generateVerificationHash,
  calculateAutoFontSize,
  generateLinkedInCertificateUrl,
  CERTIFICATE_TEMPLATES,
  buildSample50Recipients,
  buildWinnerRecipientsFromLeaderboard,
  buildWinnerTemplateFromBase,
  buildMailtoLink,
  generateBulkCertificates,
  resolveElementText,
  parseRecipientsFromText,
  renderCertificateToSvg,
} from "../certificate";
import { CanvasElement, Event, JudgeScore, MilestoneSubmission, RegisteredTeam } from "@/types";

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
    expect(firstSvg).toContain("CERTIFICATE OF PARTICIPATION");
    expect(firstSvg).toContain("For Actively Participating in HackCampus 2026");
    expect(firstSvg).not.toContain("1st Place");
    expect(fiftiethSvg).toContain("Ishita Roy");
    expect(fiftiethSvg).toContain("FAKE_LOGO_DATA");
    expect(fiftiethSvg).toContain("For Actively Participating in HackCampus 2026");
    expect(firstSvg).not.toContain("Ishita Roy");
  });

  it("generates Winner Certificates from finalized Leaderboard with Place, Team Name, Project Title & Registered Emails", () => {
    const mockEvent = {
      id: "hack-ai-2026",
      title: "HackCampus 2026",
    } as Event;

    const mockTeams: RegisteredTeam[] = [
      {
        id: "tm-1",
        eventId: "hack-ai-2026",
        teamName: "Nexus Protocol",
        leaderName: "Karthik Raja",
        leaderEmail: "karthik@nitt.edu",
        collegeName: "NIT Trichy",
        members: [
          { id: "m1", name: "Karthik Raja", email: "karthik@nitt.edu", college: "NIT Trichy", role: "lead" },
          { id: "m2", name: "Sneha Nair", email: "sneha@nitt.edu", college: "NIT Trichy", role: "member" },
        ],
        ticketId: "CF-TKT-9011",
        paymentStatus: "verified",
        registeredAt: "2026-11-14T10:30:00Z",
        checkedIn: true,
      },
      {
        id: "tm-2",
        eventId: "hack-ai-2026",
        teamName: "Aether Systems",
        leaderName: "Rohan Verma",
        leaderEmail: "rohan@iitm.ac.in",
        collegeName: "IIT Madras",
        members: [
          { id: "m3", name: "Rohan Verma", email: "rohan@iitm.ac.in", college: "IIT Madras", role: "lead" },
        ],
        ticketId: "CF-TKT-9012",
        paymentStatus: "verified",
        registeredAt: "2026-11-14T11:15:00Z",
        checkedIn: true,
      },
    ];

    const mockSubmissions: MilestoneSubmission[] = [
      {
        id: "sub-1",
        teamId: "tm-1",
        teamName: "Nexus Protocol",
        eventId: "hack-ai-2026",
        phase: 3,
        problemStatement: "Sub-second Decentralized Credit Scoring via Rust",
        techStack: ["Rust"],
        githubRepoUrl: "https://github.com/nexus/core",
        commitsCount: 40,
        submittedAt: "2026-11-14T14:00:00Z",
      },
      {
        id: "sub-2",
        teamId: "tm-2",
        teamName: "Aether Systems",
        eventId: "hack-ai-2026",
        phase: 3,
        problemStatement: "Distributed Edge Consensus for Swarms",
        techStack: ["Go"],
        githubRepoUrl: "https://github.com/aether/swarm",
        commitsCount: 30,
        submittedAt: "2026-11-14T14:30:00Z",
      },
    ];

    const mockScores: JudgeScore[] = [
      {
        id: "sc-1",
        eventId: "hack-ai-2026",
        teamId: "tm-1",
        teamName: "Nexus Protocol",
        judgeName: "Dr. K",
        scores: { r1: 9.5 },
        totalRaw: 95,
        evaluatedAt: "2026-11-14T15:00:00Z",
      },
      {
        id: "sc-2",
        eventId: "hack-ai-2026",
        teamId: "tm-2",
        teamName: "Aether Systems",
        judgeName: "Dr. K",
        scores: { r1: 8.8 },
        totalRaw: 88,
        evaluatedAt: "2026-11-14T15:10:00Z",
      },
    ];

    const winners = buildWinnerRecipientsFromLeaderboard(
      mockTeams,
      mockScores,
      mockSubmissions,
      mockEvent,
      3
    );

    expect(winners.length).toBe(3); // 2 members in #1 team + 1 member in #2 team
    expect(winners[0].name).toBe("Karthik Raja");
    expect(winners[0].email).toBe("karthik@nitt.edu");
    expect(winners[0].leaderboardRank).toBe(1);
    expect(winners[0].leaderboardPlace).toContain("1st Place");
    expect(winners[0].projectTitle).toBe("Sub-second Decentralized Credit Scoring via Rust");

    expect(winners[2].name).toBe("Rohan Verma");
    expect(winners[2].email).toBe("rohan@iitm.ac.in");
    expect(winners[2].leaderboardRank).toBe(2);
    expect(winners[2].leaderboardPlace).toContain("2nd Place");

    const winnerTemplate = buildWinnerTemplateFromBase({
      eventId: "hack-ai-2026",
      ...CERTIFICATE_TEMPLATES[0].config,
    });
    const winnerCerts = generateBulkCertificates(
      winnerTemplate,
      winners,
      "HackCampus 2026",
      "winner"
    );

    const svg1 = renderCertificateToSvg(
      winnerCerts[0].templateSnapshot,
      winnerCerts[0].recipient,
      winnerCerts[0].eventTitle
    );
    expect(svg1).toContain("Karthik Raja");
    expect(svg1).toContain("1ST PLACE");
    expect(svg1).toContain("Nexus Protocol");
    expect(svg1).toContain("Sub-second Decentralized Credit Scoring via Rust");

    const mailto = buildMailtoLink(winnerCerts[0]);
    expect(mailto).toContain("mailto:karthik%40nitt.edu");
    expect(mailto).toContain("Sub-second");
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
