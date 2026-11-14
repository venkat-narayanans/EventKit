export type EventCategory =
  | "hackathon"
  | "symposium"
  | "paper_presentation"
  | "robotics"
  | "coding_contest"
  | "project_expo"
  | "workshop";

export type EventStatus = "draft" | "registration_open" | "in_progress" | "judging" | "completed";

export interface Event {
  id: string;
  festId: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  bannerUrl?: string;
  accentColor: string; // e.g. #3b82f6
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
  upiId?: string;
  prizes: {
    first: string;
    second: string;
    third: string;
    pool: string;
  };
  rules: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  college: string;
  role: "lead" | "member";
}

export interface RegisteredTeam {
  id: string;
  eventId: string;
  teamName: string;
  leaderEmail: string;
  leaderName: string;
  collegeName: string;
  members: TeamMember[];
  ticketId: string;
  paymentStatus: "free" | "verified" | "pending";
  utrNumber?: string;
  registeredAt: string;
  checkedIn: boolean;
}

export interface MilestoneSubmission {
  id: string;
  teamId: string;
  teamName: string;
  eventId: string;
  phase: 1 | 2 | 3;
  problemStatement: string;
  techStack: string[];
  githubRepoUrl: string;
  liveDemoUrl?: string;
  presentationDeckUrl?: string;
  commitsCount: number;
  submittedAt: string;
}

export interface RubricDimension {
  id: string;
  eventId: string;
  name: string;
  description: string;
  weightPercentage: number;
  maxPoints: number;
}

export interface JudgeScore {
  id: string;
  eventId: string;
  teamId: string;
  teamName: string;
  judgeName: string;
  scores: Record<string, number>; // rubricId -> score
  totalRaw: number;
  normalizedScore?: number;
  feedback?: string;
  evaluatedAt: string;
}

export interface JudgeEvaluation {
  id: string;
  judgeId: string;
  judgeName: string;
  judgeTitle?: string;
  teamId: string;
  teamName: string;
  scores: Record<string, number>;
  totalWeightedScore: number;
  normalizedZScore?: number;
  privateNotes?: string;
  publicFeedback?: string;
  evaluatedAt: string;
}

export interface CanvasElement {
  id: string;
  type: "name" | "event" | "institution" | "role" | "date" | "qr" | "signatures";
  label: string;
  text: string;
  xPercent: number; // 0 to 100 on canvas
  yPercent: number; // 0 to 100 on canvas
  fontSize: number; // px
  fontFamily: string;
  color: string;
  fontWeight: string;
  enabled: boolean;
}

export interface CertificateConfig {
  eventId: string;
  backgroundDataUrl: string; // Base64 or URL
  elements: CanvasElement[];
  width: number;
  height: number;
}
