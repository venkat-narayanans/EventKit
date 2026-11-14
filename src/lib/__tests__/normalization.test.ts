import { describe, it, expect } from "vitest";
import {
  calculateWeightedScore,
  normalizeJudgeScores,
  aggregateTeamRankings,
} from "../normalization";
import { RubricDimension, JudgeEvaluation } from "@/types";

describe("Scoring & Z-Score Normalization Engine", () => {
  const rubrics: RubricDimension[] = [
    {
      id: "tech_complexity",
      name: "Technical Complexity",
      description: "Architecture and code quality",
      weightPercentage: 40,
      maxPoints: 10,
      descriptors: { low: "Poor", mid: "OK", high: "Great" },
    },
    {
      id: "innovation",
      name: "Innovation & Novelty",
      description: "Originality of concept",
      weightPercentage: 30,
      maxPoints: 10,
      descriptors: { low: "Clone", mid: "Standard", high: "Novel" },
    },
    {
      id: "ui_ux",
      name: "UI & UX",
      description: "Usability and polish",
      weightPercentage: 30,
      maxPoints: 10,
      descriptors: { low: "Broken", mid: "Good", high: "Flawless" },
    },
  ];

  it("calculates accurate weighted scores out of 100", () => {
    // 10/10 on 40%, 8/10 on 30%, 5/10 on 30%
    // 40 + 24 + 15 = 79.00
    const scores = {
      tech_complexity: 10,
      innovation: 8,
      ui_ux: 5,
    };

    const weighted = calculateWeightedScore(scores, rubrics);
    expect(weighted).toBe(79);
  });

  it("normalizes scores between a harsh judge and a lenient judge", () => {
    // Judge A (Harsh) gave: Team 1 -> 50, Team 2 -> 60, Team 3 -> 70 (Mean: 60)
    // Judge B (Lenient) gave: Team 4 -> 80, Team 5 -> 90, Team 6 -> 100 (Mean: 90)
    const evals: JudgeEvaluation[] = [
      {
        id: "e1",
        judgeId: "judge_harsh",
        judgeName: "Prof. Strict",
        judgeTitle: "HOD",
        teamId: "team_1",
        teamName: "Alpha",
        scores: {},
        totalWeightedScore: 50,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
      {
        id: "e2",
        judgeId: "judge_harsh",
        judgeName: "Prof. Strict",
        judgeTitle: "HOD",
        teamId: "team_2",
        teamName: "Beta",
        scores: {},
        totalWeightedScore: 60,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
      {
        id: "e3",
        judgeId: "judge_harsh",
        judgeName: "Prof. Strict",
        judgeTitle: "HOD",
        teamId: "team_3",
        teamName: "Gamma",
        scores: {},
        totalWeightedScore: 70,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
      {
        id: "e4",
        judgeId: "judge_lenient",
        judgeName: "Alum Generous",
        judgeTitle: "Dev",
        teamId: "team_4",
        teamName: "Delta",
        scores: {},
        totalWeightedScore: 80,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
      {
        id: "e5",
        judgeId: "judge_lenient",
        judgeName: "Alum Generous",
        judgeTitle: "Dev",
        teamId: "team_5",
        teamName: "Epsilon",
        scores: {},
        totalWeightedScore: 90,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
      {
        id: "e6",
        judgeId: "judge_lenient",
        judgeName: "Alum Generous",
        judgeTitle: "Dev",
        teamId: "team_6",
        teamName: "Zeta",
        scores: {},
        totalWeightedScore: 100,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026-11-14",
      },
    ];

    const normalized = normalizeJudgeScores(evals);

    const harshMeanEvaluated = normalized.find((e) => e.teamId === "team_2");
    const lenientMeanEvaluated = normalized.find((e) => e.teamId === "team_5");

    // Both median performers should receive normalized scores centered at 75.00
    expect(harshMeanEvaluated?.normalizedZScore).toBe(75);
    expect(lenientMeanEvaluated?.normalizedZScore).toBe(75);
  });

  it("aggregates final rankings accurately across multiple evaluations", () => {
    const evals: JudgeEvaluation[] = [
      {
        id: "e1",
        judgeId: "j1",
        judgeName: "J1",
        judgeTitle: "Title",
        teamId: "t1",
        teamName: "Nexus",
        scores: {},
        totalWeightedScore: 90,
        normalizedZScore: 88,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026",
      },
      {
        id: "e2",
        judgeId: "j2",
        judgeName: "J2",
        judgeTitle: "Title",
        teamId: "t1",
        teamName: "Nexus",
        scores: {},
        totalWeightedScore: 94,
        normalizedZScore: 92,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026",
      },
      {
        id: "e3",
        judgeId: "j1",
        judgeName: "J1",
        judgeTitle: "Title",
        teamId: "t2",
        teamName: "ByteForce",
        scores: {},
        totalWeightedScore: 70,
        normalizedZScore: 68,
        privateNotes: "",
        publicFeedback: "",
        evaluatedAt: "2026",
      },
    ];

    const rankings = aggregateTeamRankings(evals);
    expect(rankings[0].teamName).toBe("Nexus");
    expect(rankings[0].rank).toBe(1);
    expect(rankings[0].averageNormalizedScore).toBe(90); // (88+92)/2
    expect(rankings[1].teamName).toBe("ByteForce");
    expect(rankings[1].rank).toBe(2);
  });
});
