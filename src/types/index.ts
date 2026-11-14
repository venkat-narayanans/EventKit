export type EventCategory =
  | "hackathon"
  | "symposium"
  | "paper_presentation"
  | "robotics"
  | "coding_contest"
  | "project_expo"
  | "workshop";

export type EventStatus = "upcoming" | "registration_open" | "in_progress" | "judging" | "concluded";

export interface Event {
  id: string;
  festId: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  bannerUrl: string;
  trackColor: string; // Hex color for vibrant Kahoot/Luma badge
  venue: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  teamSizeMin: number;
  teamSizeMax: number;
  maxTeams: number;
  currentTeamsCount: number;
  isPaid: boolean;
  ticketPrice: number;
  prizes: {
    first: string;
    second: string;
    third: string;
    pool: string;
  };
  rules: string[];
  schedule: Array<{
    time: string;
    title: string;
    description: string;
    stage: "phase_1" | "phase_2" | "phase_3" | "general";
  }>;
}

export interface Fest {
  id: string;
  name: string;
  tagline: string;
  institutionName: string;
  department: string;
  logoUrl: string;
  bannerUrl: string;
  dates: string;
  location: string;
  naacGrade: string;
  events: Event[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  collegeName: string;
  rollNumber: string;
  department: string;
  yearOfStudy: string;
  githubUsername?: string;
  linkedinUrl?: string;
  verifiedBadgesCount: number;
  eventsParticipated: number;
  eventsWon: number;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  college: string;
  role: "leader" | "member";
  avatarUrl: string;
  githubUsername?: string;
}

export interface MilestoneSubmission {
  id: string;
  teamId: string;
  teamName: string;
  phase: 1 | 2 | 3;
  phaseTitle: string;
  submittedAt: string;
  problemStatement: string;
  techStack: string[];
  githubRepoUrl: string;
  liveDemoUrl?: string;
  presentationDeckUrl?: string;
  videoDemoUrl?: string;
  commitStats: {
    totalCommits: number;
    activeHours: number;
    timelineStatus: "continuous_valid" | "burst_warning" | "unverified";
  };
}

export interface RubricDimension {
  id: string;
  name: string;
  description: string;
  weightPercentage: number; // e.g., 30 for 30%
  maxPoints: number; // e.g., 10
  descriptors: {
    low: string; // e.g. "Crashes or missing core features"
    mid: string; // e.g. "Functional MVP with minor edge cases"
    high: string; // e.g. "Production-grade, optimized, novel"
  };
}

export interface JudgeEvaluation {
  id: string;
  judgeId: string;
  judgeName: string;
  judgeTitle: string;
  teamId: string;
  teamName: string;
  scores: Record<string, number>; // rubricDimensionId -> score (1-10)
  totalWeightedScore: number;
  normalizedZScore?: number;
  privateNotes: string;
  publicFeedback: string;
  evaluatedAt: string;
}

export interface VerifiableCertificate {
  certificateCode: string; // e.g., "FESTRA-2026-NIT-0042"
  recipientName: string;
  recipientRollNo: string;
  recipientCollege: string;
  eventName: string;
  festName: string;
  institutionName: string;
  role: "first_place" | "runner_up" | "top_finalist" | "participant" | "mentor";
  roleLabel: string;
  issuedDate: string;
  verificationHash: string;
  verificationUrl: string;
  proofOfWork: {
    projectName: string;
    projectTagline: string;
    githubRepoUrl?: string;
    liveDemoUrl?: string;
    presentationDeckUrl?: string;
    rankText: string;
  };
  designTemplate: {
    backgroundUrl: string;
    textColor: string;
    accentColor: string;
    signatory1: { name: string; title: string; signatureUrl: string };
    signatory2: { name: string; title: string; signatureUrl: string };
  };
}

export interface NAACDossier {
  eventTitle: string;
  institution: string;
  academicYear: string;
  naacCriteria: string[]; // e.g. ["Criterion 3.3.2", "Criterion 5.3.3"]
  stats: {
    totalRegistrations: number;
    verifiedAttendees: number;
    maleCount: number;
    femaleCount: number;
    internalCount: number;
    externalCount: number;
    externalInstitutionsCount: number;
  };
  outcomesSummary: string;
  geoPhotos: Array<{
    url: string;
    caption: string;
    lat: number;
    lng: number;
    timestamp: string;
  }>;
}
