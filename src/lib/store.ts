import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Event,
  RegisteredTeam,
  MilestoneSubmission,
  RubricDimension,
  JudgeScore,
  CertificateConfig,
  CanvasElement,
  CertificateRecipient,
  GeneratedCertificate,
} from "@/types";
import {
  CERTIFICATE_TEMPLATES,
  CERT_CANVAS_HEIGHT,
  CERT_CANVAS_WIDTH,
  buildWinnerRecipientsFromLeaderboard,
  buildWinnerTemplateFromBase,
  generateBulkCertificates,
} from "./certificate";

const INITIAL_EVENTS: Event[] = [
  {
    id: "hack-ai-2026",
    festId: "campus-fest-1",
    title: "HackCampus: 24h AI Systems Hackathon",
    category: "hackathon",
    tagline: "Build production-ready distributed systems and AI applications",
    description: "An intensive 24-hour sprint. Build real software, deploy to production, and pitch live to engineering leaders.",
    accentColor: "#3b82f6", // Clean electric blue
    venue: "Innovation Center / Lab 402",
    startDate: "2026-11-20T09:00",
    endDate: "2026-11-21T09:00",
    registrationDeadline: "2026-11-19T23:59",
    teamSizeMin: 2,
    teamSizeMax: 4,
    maxTeams: 50,
    currentTeamsCount: 12,
    isPaid: true,
    ticketPrice: 200,
    upiId: "fest@okicici",
    prizes: {
      first: "₹30,000",
      second: "₹15,000",
      third: "₹10,000",
      pool: "₹55,000",
    },
    rules: [
      "All code must be authored during the hackathon window",
      "Git commit history will be verified for plagiarism and pre-built code",
      "Teams must present a working deployed prototype and pitch deck",
    ],
  },
  {
    id: "paper-symposium-2026",
    festId: "campus-fest-1",
    title: "National Technical Paper Presentation",
    category: "paper_presentation",
    tagline: "Present peer-reviewed research in Machine Learning, Robotics & Systems",
    description: "Submit and present technical research papers following IEEE standard two-column formatting.",
    accentColor: "#10b981", // Emerald
    venue: "Main Auditorium Hall A",
    startDate: "2026-11-21T10:00",
    endDate: "2026-11-21T16:00",
    registrationDeadline: "2026-11-18T23:59",
    teamSizeMin: 1,
    teamSizeMax: 3,
    maxTeams: 30,
    currentTeamsCount: 8,
    isPaid: false,
    ticketPrice: 0,
    prizes: {
      first: "₹15,000",
      second: "₹10,000",
      third: "₹5,000",
      pool: "₹30,000",
    },
    rules: [
      "Max 6 pages IEEE manuscript format",
      "Plagiarism similarity must be under 15%",
      "8 mins presentation + 4 mins jury Q&A",
    ],
  },
];

const INITIAL_RUBRICS: RubricDimension[] = [
  {
    id: "r-tech",
    eventId: "hack-ai-2026",
    name: "Technical Complexity & Code Quality",
    description: "Architecture, system design, test coverage, and clean abstractions",
    weightPercentage: 35,
    maxPoints: 10,
  },
  {
    id: "r-novelty",
    eventId: "hack-ai-2026",
    name: "Novelty & Originality",
    description: "Unique problem solving versus cloning tutorials",
    weightPercentage: 25,
    maxPoints: 10,
  },
  {
    id: "r-ux",
    eventId: "hack-ai-2026",
    name: "UI / UX Polish & Execution",
    description: "Visual hierarchy, zero-friction workflows, responsive feedback",
    weightPercentage: 20,
    maxPoints: 10,
  },
  {
    id: "r-pitch",
    eventId: "hack-ai-2026",
    name: "Live Pitch & Q&A Defense",
    description: "Clarity of value proposition, technical answers during jury defense",
    weightPercentage: 20,
    maxPoints: 10,
  },
];

const DEFAULT_CERT_CONFIG: CertificateConfig = {
  eventId: "hack-ai-2026",
  ...CERTIFICATE_TEMPLATES[0].config,
  elements: CERTIFICATE_TEMPLATES[0].config.elements.map((e) => ({ ...e })),
};

interface FestraStore {
  // Navigation & Workspace State
  viewMode: "landing" | "dashboard" | "portal"; // landing = fortnite theme landing page; dashboard = organizer tool; portal = student participant view
  setViewMode: (mode: "landing" | "dashboard" | "portal") => void;

  activeSection: "events" | "submissions" | "judging" | "leaderboard" | "certificates" | "compliance";
  setActiveSection: (section: FestraStore["activeSection"]) => void;

  selectedEventId: string;
  setSelectedEventId: (id: string) => void;

  // Events CRUD
  events: Event[];
  createEvent: (event: Omit<Event, "id" | "currentTeamsCount">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Registered Teams & Attendance
  teams: RegisteredTeam[];
  registerTeam: (team: Omit<RegisteredTeam, "id" | "registeredAt" | "checkedIn" | "ticketId">) => RegisteredTeam;
  toggleCheckIn: (teamId: string) => void;

  // Milestone Submissions
  submissions: MilestoneSubmission[];
  submitMilestone: (sub: Omit<MilestoneSubmission, "id" | "submittedAt">) => void;

  // Rubrics & Judging
  rubrics: RubricDimension[];
  addRubric: (rubric: Omit<RubricDimension, "id">) => void;
  updateRubric: (id: string, updates: Partial<RubricDimension>) => void;
  deleteRubric: (id: string) => void;

  judgeScores: JudgeScore[];
  submitScore: (score: Omit<JudgeScore, "id" | "evaluatedAt" | "totalRaw">) => void;

  // Leaderboard Finalization
  finalizedLeaderboards: Record<string, boolean>;
  toggleFinalizeLeaderboard: (eventId: string, finalized: boolean) => void;

  // Certificate Studio (Canva-Grade BYOD + Bulk Generation)
  certStudioView: "editor" | "gallery";
  setCertStudioView: (view: "editor" | "gallery") => void;
  certGalleryTab: "participation" | "winner";
  setCertGalleryTab: (tab: "participation" | "winner") => void;

  certConfig: CertificateConfig;
  updateCertConfig: (updates: Partial<CertificateConfig>) => void;
  applyCertTemplate: (config: CertificateConfig) => void;
  updateCertElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateCertBackground: (dataUrl: string) => void;
  addCertElement: (el: Omit<CanvasElement, "id">) => string;
  deleteCertElement: (id: string) => void;
  duplicateCertElement: (id: string) => string | null;
  reorderCertElement: (id: string, direction: "up" | "down") => void;

  // Bulk Recipients & Generated Certificates (Participation + Winners)
  customRecipients: Record<string, CertificateRecipient[]>;
  addCustomRecipients: (eventId: string, recipients: CertificateRecipient[]) => void;
  replaceCustomRecipients: (eventId: string, recipients: CertificateRecipient[]) => void;
  clearCustomRecipients: (eventId: string) => void;
  generatedCertificates: GeneratedCertificate[];
  generateAllCertificates: (
    eventId: string,
    recipients: CertificateRecipient[],
    eventTitle: string
  ) => GeneratedCertificate[];
  generateWinnerCertificatesFromLeaderboard: (eventId: string) => GeneratedCertificate[];
  markCertificateEmailsSent: (certIds: string[]) => void;
  clearGeneratedCertificates: (eventId: string) => void;

  // Reset to initial clean state
  resetAll: () => void;
}

export const useStore = create<FestraStore>()(
  persist(
    (set, get) => ({
      viewMode: "landing",
      setViewMode: (mode) => set({ viewMode: mode }),

      activeSection: "events",
      setActiveSection: (sec) => set({ activeSection: sec }),

      selectedEventId: "hack-ai-2026",
      setSelectedEventId: (id) => set({ selectedEventId: id }),

      events: INITIAL_EVENTS,
      createEvent: (eventData) => {
        const newId = `evt-${Date.now()}`;
        const newEvent: Event = {
          ...eventData,
          id: newId,
          currentTeamsCount: 0,
        };
        set((state) => ({
          events: [newEvent, ...state.events],
          selectedEventId: newId,
          activeSection: "events",
        }));
      },
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },
      deleteEvent: (id) => {
        set((state) => {
          const remaining = state.events.filter((e) => e.id !== id);
          return {
            events: remaining,
            selectedEventId: remaining[0]?.id || "",
          };
        });
      },

      teams: [
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
          utrNumber: "432190887123",
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
            { id: "m4", name: "Ananya Iyer", email: "ananya@iitm.ac.in", college: "IIT Madras", role: "member" },
          ],
          ticketId: "CF-TKT-9012",
          paymentStatus: "verified",
          utrNumber: "432190887456",
          registeredAt: "2026-11-14T11:15:00Z",
          checkedIn: true,
        },
        {
          id: "tm-3",
          eventId: "hack-ai-2026",
          teamName: "Quantum Drift",
          leaderName: "Aditya Krishnan",
          leaderEmail: "aditya@nitk.edu.in",
          collegeName: "NIT Surathkal",
          members: [
            { id: "m5", name: "Aditya Krishnan", email: "aditya@nitk.edu.in", college: "NIT Surathkal", role: "lead" },
            { id: "m6", name: "Diya Menon", email: "diya@nitk.edu.in", college: "NIT Surathkal", role: "member" },
          ],
          ticketId: "CF-TKT-9013",
          paymentStatus: "verified",
          utrNumber: "432190887789",
          registeredAt: "2026-11-14T11:45:00Z",
          checkedIn: true,
        },
      ],
      registerTeam: (teamData) => {
        const ticketId = `CF-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTeam: RegisteredTeam = {
          ...teamData,
          id: `tm-${Date.now()}`,
          ticketId,
          registeredAt: new Date().toISOString(),
          checkedIn: false,
        };
        set((state) => ({
          teams: [newTeam, ...state.teams],
          events: state.events.map((e) =>
            e.id === teamData.eventId ? { ...e, currentTeamsCount: e.currentTeamsCount + 1 } : e
          ),
        }));
        return newTeam;
      },
      toggleCheckIn: (teamId) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, checkedIn: !t.checkedIn } : t
          ),
        }));
      },

      submissions: [
        {
          id: "sub-1",
          teamId: "tm-1",
          teamName: "Nexus Protocol",
          eventId: "hack-ai-2026",
          phase: 3,
          problemStatement: "Sub-second Decentralized Credit Scoring via Rust & WASM",
          techStack: ["Rust", "WASM", "Next.js", "Postgres"],
          githubRepoUrl: "https://github.com/nexus-protocol/credit-core",
          liveDemoUrl: "https://nexus-demo.vercel.app",
          presentationDeckUrl: "https://cdn.example.com/nexus-deck.pdf",
          commitsCount: 42,
          submittedAt: "2026-11-14T14:20:00Z",
        },
        {
          id: "sub-2",
          teamId: "tm-2",
          teamName: "Aether Systems",
          eventId: "hack-ai-2026",
          phase: 3,
          problemStatement: "Distributed Edge Consensus for Multi-Agent Swarm Coordination",
          techStack: ["Go", "Libp2p", "React", "WebSockets"],
          githubRepoUrl: "https://github.com/aether-systems/swarm-consensus",
          liveDemoUrl: "https://aether-swarm.vercel.app",
          presentationDeckUrl: "https://cdn.example.com/aether-deck.pdf",
          commitsCount: 36,
          submittedAt: "2026-11-14T14:45:00Z",
        },
        {
          id: "sub-3",
          teamId: "tm-3",
          teamName: "Quantum Drift",
          eventId: "hack-ai-2026",
          phase: 3,
          problemStatement: "Real-Time Neural Traffic Flow Optimizer for Smart Campuses",
          techStack: ["Python", "PyTorch", "FastAPI", "Next.js"],
          githubRepoUrl: "https://github.com/quantum-drift/neural-traffic",
          liveDemoUrl: "https://quantum-drift.vercel.app",
          presentationDeckUrl: "https://cdn.example.com/quantum-deck.pdf",
          commitsCount: 29,
          submittedAt: "2026-11-14T15:05:00Z",
        },
      ],
      submitMilestone: (subData) => {
        const newSub: MilestoneSubmission = {
          ...subData,
          id: `sub-${Date.now()}`,
          submittedAt: new Date().toISOString(),
        };
        set((state) => ({
          submissions: [newSub, ...state.submissions.filter((s) => s.teamId !== subData.teamId || s.phase !== subData.phase)],
        }));
      },

      rubrics: INITIAL_RUBRICS,
      addRubric: (rubricData) => {
        set((state) => ({
          rubrics: [...state.rubrics, { ...rubricData, id: `r-${Date.now()}` }],
        }));
      },
      updateRubric: (id, updates) => {
        set((state) => ({
          rubrics: state.rubrics.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },
      deleteRubric: (id) => {
        set((state) => ({
          rubrics: state.rubrics.filter((r) => r.id !== id),
        }));
      },

      judgeScores: [
        {
          id: "sc-1",
          eventId: "hack-ai-2026",
          teamId: "tm-1",
          teamName: "Nexus Protocol",
          judgeName: "Dr. K. Ramanathan",
          scores: {
            "r-tech": 9.5,
            "r-novelty": 9.5,
            "r-ux": 9.0,
            "r-pitch": 9.5,
          },
          totalRaw: 94.0,
          normalizedScore: 95.0,
          feedback: "Outstanding Rust + WASM architecture and sub-second benchmarks.",
          evaluatedAt: "2026-11-14T15:00:00Z",
        },
        {
          id: "sc-2",
          eventId: "hack-ai-2026",
          teamId: "tm-2",
          teamName: "Aether Systems",
          judgeName: "Dr. K. Ramanathan",
          scores: {
            "r-tech": 9.0,
            "r-novelty": 9.0,
            "r-ux": 8.5,
            "r-pitch": 9.0,
          },
          totalRaw: 89.0,
          normalizedScore: 90.0,
          feedback: "Impressive distributed edge consensus and resilient swarm demo.",
          evaluatedAt: "2026-11-14T15:10:00Z",
        },
        {
          id: "sc-3",
          eventId: "hack-ai-2026",
          teamId: "tm-3",
          teamName: "Quantum Drift",
          judgeName: "Dr. K. Ramanathan",
          scores: {
            "r-tech": 8.5,
            "r-novelty": 8.5,
            "r-ux": 8.5,
            "r-pitch": 8.0,
          },
          totalRaw: 84.0,
          normalizedScore: 85.0,
          feedback: "Strong neural optimization model with clear campus impact.",
          evaluatedAt: "2026-11-14T15:20:00Z",
        },
      ],
      submitScore: (scoreData) => {
        const rawScore = Object.values(scoreData.scores).reduce((a, b) => a + b, 0) / (Object.keys(scoreData.scores).length || 1) * 10;
        const newScore: JudgeScore = {
          ...scoreData,
          id: `sc-${Date.now()}`,
          totalRaw: Math.min(100, Math.round(rawScore)),
          normalizedScore: Math.min(100, Math.round(rawScore)),
          evaluatedAt: new Date().toISOString(),
        };
        set((state) => ({
          judgeScores: [newScore, ...state.judgeScores.filter((s) => s.teamId !== scoreData.teamId || s.judgeName !== scoreData.judgeName)],
        }));
      },

      finalizedLeaderboards: {},
      toggleFinalizeLeaderboard: (eventId, finalized) => {
        set((state) => ({
          finalizedLeaderboards: {
            ...state.finalizedLeaderboards,
            [eventId]: finalized,
          },
        }));
      },

      certStudioView: "editor",
      setCertStudioView: (view) => set({ certStudioView: view }),
      certGalleryTab: "participation",
      setCertGalleryTab: (tab) => set({ certGalleryTab: tab }),

      certConfig: DEFAULT_CERT_CONFIG,
      updateCertConfig: (updates) => {
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            ...updates,
          },
        }));
      },
      applyCertTemplate: (config) => {
        set({
          certConfig: {
            ...config,
            width: config.width || CERT_CANVAS_WIDTH,
            height: config.height || CERT_CANVAS_HEIGHT,
            elements: config.elements.map((el) => ({ ...el })),
          },
        });
      },
      updateCertElement: (id, updates) => {
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: state.certConfig.elements.map((el) =>
              el.id === id ? { ...el, ...updates } : el
            ),
          },
        }));
      },
      updateCertBackground: (dataUrl) => {
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            backgroundDataUrl: dataUrl,
          },
        }));
      },
      addCertElement: (elData) => {
        const newId = `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: [...state.certConfig.elements, { ...elData, id: newId }],
          },
        }));
        return newId;
      },
      deleteCertElement: (id) => {
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: state.certConfig.elements.filter((el) => el.id !== id),
          },
        }));
      },
      duplicateCertElement: (id) => {
        const existing = get().certConfig.elements.find((e) => e.id === id);
        if (!existing) return null;
        const newId = `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const copy: CanvasElement = {
          ...existing,
          id: newId,
          label: `${existing.label} (Copy)`,
          xPercent: Math.min(92, existing.xPercent + 3),
          yPercent: Math.min(92, existing.yPercent + 3),
        };
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: [...state.certConfig.elements, copy],
          },
        }));
        return newId;
      },
      reorderCertElement: (id, direction) => {
        set((state) => {
          const list = [...state.certConfig.elements];
          const idx = list.findIndex((e) => e.id === id);
          if (idx === -1) return state;
          const targetIdx = direction === "up" ? idx + 1 : idx - 1;
          if (targetIdx < 0 || targetIdx >= list.length) return state;
          const [moved] = list.splice(idx, 1);
          list.splice(targetIdx, 0, moved);
          return {
            certConfig: {
              ...state.certConfig,
              elements: list,
            },
          };
        });
      },

      customRecipients: {},
      addCustomRecipients: (eventId, recipients) => {
        set((state) => ({
          customRecipients: {
            ...state.customRecipients,
            [eventId]: [...(state.customRecipients[eventId] || []), ...recipients],
          },
        }));
      },
      replaceCustomRecipients: (eventId, recipients) => {
        set((state) => ({
          customRecipients: {
            ...state.customRecipients,
            [eventId]: recipients,
          },
        }));
      },
      clearCustomRecipients: (eventId) => {
        set((state) => {
          const next = { ...state.customRecipients };
          delete next[eventId];
          return { customRecipients: next };
        });
      },

      generatedCertificates: [],
      generateAllCertificates: (eventId, recipients, eventTitle) => {
        const templateConfig: CertificateConfig = {
          ...get().certConfig,
          eventId,
        };
        const batch = generateBulkCertificates(
          templateConfig,
          recipients,
          eventTitle,
          "participation"
        );
        set((state) => ({
          generatedCertificates: [
            // Keep winner certificates untouched when regenerating participation certificates!
            ...state.generatedCertificates.filter(
              (c) => !(c.eventId === eventId && c.batchType === "participation")
            ),
            ...batch,
          ],
          certStudioView: "gallery",
          certGalleryTab: "participation",
        }));
        return batch;
      },
      generateWinnerCertificatesFromLeaderboard: (eventId) => {
        const state = get();
        const event = state.events.find((e) => e.id === eventId) || state.events[0];
        const eventTitle = event?.title || "HackCampus 2026";
        const winners = buildWinnerRecipientsFromLeaderboard(
          state.teams,
          state.judgeScores,
          state.submissions,
          event,
          3
        );
        const winnerTemplate = buildWinnerTemplateFromBase({
          ...state.certConfig,
          eventId,
        });
        const batch = generateBulkCertificates(
          winnerTemplate,
          winners,
          eventTitle,
          "winner"
        );
        set((prev) => ({
          finalizedLeaderboards: {
            ...prev.finalizedLeaderboards,
            [eventId]: true,
          },
          generatedCertificates: [
            // Keep participation certificates untouched when generating winner certificates!
            ...prev.generatedCertificates.filter(
              (c) => !(c.eventId === eventId && c.batchType === "winner")
            ),
            ...batch,
          ],
          activeSection: "certificates",
          certStudioView: "gallery",
          certGalleryTab: "winner",
        }));
        return batch;
      },
      markCertificateEmailsSent: (certIds) => {
        const idSet = new Set(certIds);
        const sentTimestamp = new Date().toISOString();
        set((state) => ({
          generatedCertificates: state.generatedCertificates.map((c) =>
            idSet.has(c.id) ? { ...c, emailSentAt: sentTimestamp } : c
          ),
        }));
      },
      clearGeneratedCertificates: (eventId) => {
        set((state) => ({
          generatedCertificates: state.generatedCertificates.filter((c) => c.eventId !== eventId),
        }));
      },

      resetAll: () => {
        set({
          events: INITIAL_EVENTS,
          rubrics: INITIAL_RUBRICS,
          certConfig: DEFAULT_CERT_CONFIG,
          customRecipients: {},
          generatedCertificates: [],
          finalizedLeaderboards: {},
          certStudioView: "editor",
          certGalleryTab: "participation",
        });
      },
    }),
    {
      name: "festra-workspace-v4",
      partialize: (state) => ({
        viewMode: state.viewMode,
        activeSection: state.activeSection,
        selectedEventId: state.selectedEventId,
        events: state.events,
        teams: state.teams,
        submissions: state.submissions,
        rubrics: state.rubrics,
        judgeScores: state.judgeScores,
        finalizedLeaderboards: state.finalizedLeaderboards,
        certConfig: state.certConfig,
        customRecipients: state.customRecipients,
      }),
    }
  )
);
