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
} from "@/types";
import { calculateWeightedScore, normalizeJudgeScores, aggregateTeamRankings } from "./normalization";

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

const DEFAULT_CANVAS_ELEMENTS: CanvasElement[] = [
  {
    id: "el-institution",
    type: "institution",
    label: "Host College / Institution",
    text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
    xPercent: 50,
    yPercent: 18,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    color: "#94a3b8",
    fontWeight: "600",
    enabled: true,
  },
  {
    id: "el-title",
    type: "event",
    label: "Certificate Title",
    text: "CERTIFICATE OF ACHIEVEMENT",
    xPercent: 50,
    yPercent: 26,
    fontSize: 26,
    fontFamily: "Georgia, serif",
    color: "#f8fafc",
    fontWeight: "700",
    enabled: true,
  },
  {
    id: "el-name",
    type: "name",
    label: "Participant Name",
    text: "Alex R. Chen",
    xPercent: 50,
    yPercent: 48,
    fontSize: 38,
    fontFamily: "Georgia, serif",
    color: "#ffffff",
    fontWeight: "700",
    enabled: true,
  },
  {
    id: "el-role",
    type: "role",
    label: "Achievement / Award",
    text: "First Place Winner — HackCampus 2026",
    xPercent: 50,
    yPercent: 60,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    color: "#38bdf8",
    fontWeight: "600",
    enabled: true,
  },
  {
    id: "el-date",
    type: "date",
    label: "Event Date",
    text: "Issued on November 21, 2026",
    xPercent: 20,
    yPercent: 84,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#64748b",
    fontWeight: "500",
    enabled: true,
  },
  {
    id: "el-signatures",
    type: "signatures",
    label: "Faculty Signatures",
    text: "Dr. K. Ramanathan (HOD)   •   Dr. S. Meenakshi (Convener)",
    xPercent: 80,
    yPercent: 84,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#cbd5e1",
    fontWeight: "500",
    enabled: true,
  },
  {
    id: "el-qr",
    type: "qr",
    label: "Verification QR Code",
    text: "VERIFY: CF-2026-8921",
    xPercent: 50,
    yPercent: 82,
    fontSize: 10,
    fontFamily: "monospace",
    color: "#64748b",
    fontWeight: "500",
    enabled: true,
  },
];

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

  // Certificate Studio (BYOD)
  certConfig: CertificateConfig;
  updateCertElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateCertBackground: (dataUrl: string) => void;
  addCertElement: (el: Omit<CanvasElement, "id">) => void;
  deleteCertElement: (id: string) => void;

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
          ],
          ticketId: "CF-TKT-9012",
          paymentStatus: "verified",
          utrNumber: "432190887456",
          registeredAt: "2026-11-14T11:15:00Z",
          checkedIn: false,
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
          problemStatement: "Sub-second decentralized credit scoring via Rust & WASM",
          techStack: ["Rust", "WASM", "Next.js", "Postgres"],
          githubRepoUrl: "https://github.com/nexus-protocol/credit-core",
          liveDemoUrl: "https://nexus-demo.vercel.app",
          presentationDeckUrl: "https://cdn.example.com/nexus-deck.pdf",
          commitsCount: 42,
          submittedAt: "2026-11-14T14:20:00Z",
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
            "r-novelty": 9.0,
            "r-ux": 8.5,
            "r-pitch": 9.0,
          },
          totalRaw: 90.75,
          normalizedScore: 91.2,
          feedback: "Solid systems architecture and clean Rust benchmarks.",
          evaluatedAt: "2026-11-14T15:00:00Z",
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

      certConfig: {
        eventId: "hack-ai-2026",
        backgroundDataUrl: "", // Defaults to clean dark geometric canvas
        elements: DEFAULT_CANVAS_ELEMENTS,
        width: 1920,
        height: 1080,
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
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: [...state.certConfig.elements, { ...elData, id: `el-${Date.now()}` }],
          },
        }));
      },
      deleteCertElement: (id) => {
        set((state) => ({
          certConfig: {
            ...state.certConfig,
            elements: state.certConfig.elements.filter((el) => el.id !== id),
          },
        }));
      },

      resetAll: () => {
        set({
          events: INITIAL_EVENTS,
          rubrics: INITIAL_RUBRICS,
          certConfig: {
            eventId: "hack-ai-2026",
            backgroundDataUrl: "",
            elements: DEFAULT_CANVAS_ELEMENTS,
            width: 1920,
            height: 1080,
          },
        });
      },
    }),
    {
      name: "festra-workspace-v2",
    }
  )
);
