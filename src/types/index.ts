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

export type CanvasElementType =
  | "name"
  | "event"
  | "institution"
  | "role"
  | "date"
  | "qr"
  | "signatures"
  | "custom_text"
  | "logo"
  | "signature_img"
  | "seal"
  | "divider"
  | "box";

export type CanvasElementKind = "text" | "image" | "shape" | "badge" | "qr";

export type CertificateBorderStyle =
  | "none"
  | "classic_double"
  | "modern_accent"
  | "ornate_corners"
  | "minimal_line";

export type CertificateBadgeStyle =
  | "gold_seal"
  | "blue_crest"
  | "star_ribbon"
  | "verified_stamp";

export interface CanvasElement {
  id: string;
  kind?: CanvasElementKind; // defaults to "text" (or inferred from type)
  type: CanvasElementType;
  label: string;
  text: string;
  xPercent: number; // 0 to 100 on canvas
  yPercent: number; // 0 to 100 on canvas
  fontSize: number; // px in virtual 1200x850 canvas coordinate space
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "capitalize";
  letterSpacing?: number; // px
  textAlign?: "left" | "center" | "right";
  opacity?: number; // 0 to 1
  rotation?: number; // degrees
  enabled: boolean;
  locked?: boolean;
  // Image / Logo / Signature / Shape / Badge properties
  imageDataUrl?: string;
  widthPercent?: number; // % of canvas width (1..100)
  heightPercent?: number; // % of canvas height (0.2..100)
  borderRadius?: number; // px (999 for circular)
  badgeStyle?: CertificateBadgeStyle;
  shapeType?: "line" | "rectangle" | "pill";
}

export interface CertificateConfig {
  eventId: string;
  templateId?: string;
  backgroundDataUrl: string; // Base64 or URL
  backgroundColor?: string;
  backgroundGradient?: string;
  borderStyle?: CertificateBorderStyle;
  borderColor?: string;
  accentColor?: string;
  elements: CanvasElement[];
  width: number;
  height: number;
}

export type CertificateBatchType = "participation" | "winner";

export interface CertificateRecipient {
  id: string;
  name: string;
  email: string;
  teamName: string;
  collegeName: string;
  awardRole: string;
  projectTitle?: string;
  leaderboardPlace?: string; // e.g. "1st Place — Grand Prize Winner"
  leaderboardRank?: number; // 1, 2, 3
  certificateType?: CertificateBatchType;
  certificateCode: string;
  verificationHash: string;
  issueDate: string;
  source: "registration" | "imported" | "leaderboard";
}

export interface GeneratedCertificate {
  id: string;
  eventId: string;
  eventTitle: string;
  batchType: CertificateBatchType;
  recipient: CertificateRecipient;
  generatedAt: string;
  emailSentAt?: string;
  templateSnapshot: CertificateConfig;
}
