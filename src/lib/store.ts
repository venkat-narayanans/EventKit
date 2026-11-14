import { create } from "zustand";
import {
  Fest,
  Event,
  MilestoneSubmission,
  RubricDimension,
  JudgeEvaluation,
  VerifiableCertificate,
  NAACDossier,
} from "@/types";
import {
  MOCK_FEST,
  MOCK_EVENTS,
  MOCK_SUBMISSIONS,
  MOCK_RUBRICS,
  MOCK_EVALUATIONS,
  MOCK_CERTIFICATE,
  MOCK_NAAC_DOSSIER,
} from "./mock-data";
import {
  calculateWeightedScore,
  normalizeJudgeScores,
  aggregateTeamRankings,
} from "./normalization";
import { generateVerificationHash } from "./certificate";

interface FestraState {
  activeTab: "explore" | "fest" | "pipeline" | "judging" | "leaderboard" | "certificates" | "naac";
  setActiveTab: (tab: FestraState["activeTab"]) => void;

  fest: Fest;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;

  submissions: MilestoneSubmission[];
  addSubmission: (submission: MilestoneSubmission) => void;

  rubrics: RubricDimension[];
  updateRubricWeight: (id: string, weightPercentage: number) => void;
  addRubricDimension: (dimension: RubricDimension) => void;

  evaluations: JudgeEvaluation[];
  addEvaluation: (
    judgeId: string,
    judgeName: string,
    judgeTitle: string,
    teamId: string,
    teamName: string,
    scores: Record<string, number>,
    privateNotes: string,
    publicFeedback: string
  ) => void;

  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  offlineScannedCount: number;
  scanTicketOffline: () => void;

  certificate: VerifiableCertificate;
  updateCertificateDesign: (template: Partial<VerifiableCertificate["designTemplate"]>) => void;

  naacDossier: NAACDossier;

  // Normalized rankings helper
  getRankings: () => ReturnType<typeof aggregateTeamRankings>;
}

export const useFestraStore = create<FestraState>((set, get) => ({
  activeTab: "explore",
  setActiveTab: (tab) => set({ activeTab: tab }),

  fest: MOCK_FEST,
  selectedEventId: "hack-sphere-2026",
  setSelectedEventId: (id) => set({ selectedEventId: id }),

  submissions: MOCK_SUBMISSIONS,
  addSubmission: (submission) =>
    set((state) => ({ submissions: [submission, ...state.submissions] })),

  rubrics: MOCK_RUBRICS,
  updateRubricWeight: (id, weight) =>
    set((state) => ({
      rubrics: state.rubrics.map((r) => (r.id === id ? { ...r, weightPercentage: weight } : r)),
    })),
  addRubricDimension: (dim) =>
    set((state) => ({
      rubrics: [...state.rubrics, dim],
    })),

  evaluations: normalizeJudgeScores(MOCK_EVALUATIONS),
  addEvaluation: (
    judgeId,
    judgeName,
    judgeTitle,
    teamId,
    teamName,
    scores,
    privateNotes,
    publicFeedback
  ) => {
    const rawScore = calculateWeightedScore(scores, get().rubrics);
    const newEval: JudgeEvaluation = {
      id: `eval-${Date.now()}`,
      judgeId,
      judgeName,
      judgeTitle,
      teamId,
      teamName,
      scores,
      totalWeightedScore: rawScore,
      privateNotes,
      publicFeedback,
      evaluatedAt: new Date().toISOString(),
    };

    const updatedList = normalizeJudgeScores([...get().evaluations, newEval]);
    set({ evaluations: updatedList });
  },

  isOfflineMode: false,
  toggleOfflineMode: () => set((state) => ({ isOfflineMode: !state.isOfflineMode })),
  offlineScannedCount: 318,
  scanTicketOffline: () =>
    set((state) => ({ offlineScannedCount: state.offlineScannedCount + 1 })),

  certificate: MOCK_CERTIFICATE,
  updateCertificateDesign: (templateUpdates) =>
    set((state) => ({
      certificate: {
        ...state.certificate,
        designTemplate: {
          ...state.certificate.designTemplate,
          ...templateUpdates,
        },
      },
    })),

  naacDossier: MOCK_NAAC_DOSSIER,

  getRankings: () => {
    return aggregateTeamRankings(get().evaluations);
  },
}));
