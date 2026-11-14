import { RubricDimension, JudgeEvaluation } from "@/types";

/**
 * Calculates the raw weighted score for an evaluation based on rubric dimensions.
 * Returns score out of 100.
 */
export function calculateWeightedScore(
  scores: Record<string, number>,
  rubrics: RubricDimension[]
): number {
  let totalScore = 0;
  let totalWeight = 0;

  for (const rubric of rubrics) {
    const rawScore = scores[rubric.id] ?? 0;
    const normalizedPoints = Math.min(Math.max(rawScore, 0), rubric.maxPoints) / rubric.maxPoints;
    totalScore += normalizedPoints * rubric.weightPercentage;
    totalWeight += rubric.weightPercentage;
  }

  if (totalWeight === 0) return 0;
  // Normalize to 100% scale if weights don't sum to exactly 100
  return Number(((totalScore / totalWeight) * 100).toFixed(2));
}

/**
 * Normalizes scores across multiple judges to eliminate the "Harsh vs. Lenient Judge" bias.
 * Uses Z-Score Standardization:
 * Z = (Score - Mean_Judge) / StdDev_Judge
 * Scaled Score = 75 + (Z * 12.5) [Anchored with mean 75, stddev 12.5, clamped 0-100]
 */
export function normalizeJudgeScores(evaluations: JudgeEvaluation[]): JudgeEvaluation[] {
  if (evaluations.length === 0) return [];

  // Group evaluations by judge
  const judgeGroups = new Map<string, JudgeEvaluation[]>();
  for (const ev of evaluations) {
    const list = judgeGroups.get(ev.judgeId) || [];
    list.push(ev);
    judgeGroups.set(ev.judgeId, list);
  }

  const normalizedResults: JudgeEvaluation[] = [];

  judgeGroups.forEach((evals) => {
    if (evals.length <= 1) {
      // With only 1 evaluation from a judge, Z-score cannot be calculated; retain raw score
      for (const ev of evals) {
        normalizedResults.push({
          ...ev,
          normalizedZScore: ev.totalWeightedScore,
        });
      }
      return;
    }

    const mean = evals.reduce((sum, e) => sum + e.totalWeightedScore, 0) / evals.length;
    const variance =
      evals.reduce((sum, e) => sum + Math.pow(e.totalWeightedScore - mean, 2), 0) / evals.length;
    const stdDev = Math.sqrt(variance);

    for (const ev of evals) {
      let scaledScore: number;
      if (stdDev === 0) {
        scaledScore = ev.totalWeightedScore;
      } else {
        const z = (ev.totalWeightedScore - mean) / stdDev;
        // Map Z-score (-2 to +2) onto a 50 - 100 fair rating scale
        scaledScore = Math.min(100, Math.max(0, 75 + z * 12.5));
      }

      normalizedResults.push({
        ...ev,
        normalizedZScore: Number(scaledScore.toFixed(2)),
      });
    }
  });

  return normalizedResults;
}

/**
 * Aggregates evaluations per team across all assigned judges to produce final leaderboard rankings.
 */
export function aggregateTeamRankings(evaluations: JudgeEvaluation[]): Array<{
  teamId: string;
  teamName: string;
  judgeCount: number;
  averageRawScore: number;
  averageNormalizedScore: number;
  rank: number;
}> {
  const teamMap = new Map<
    string,
    { teamName: string; rawTotal: number; normTotal: number; count: number }
  >();

  for (const ev of evaluations) {
    const existing = teamMap.get(ev.teamId) || {
      teamName: ev.teamName,
      rawTotal: 0,
      normTotal: 0,
      count: 0,
    };
    existing.rawTotal += ev.totalWeightedScore;
    existing.normTotal += ev.normalizedZScore ?? ev.totalWeightedScore;
    existing.count += 1;
    teamMap.set(ev.teamId, existing);
  }

  const results = Array.from(teamMap.entries()).map(([teamId, data]) => ({
    teamId,
    teamName: data.teamName,
    judgeCount: data.count,
    averageRawScore: Number((data.rawTotal / data.count).toFixed(2)),
    averageNormalizedScore: Number((data.normTotal / data.count).toFixed(2)),
    rank: 0,
  }));

  // Sort descending by normalized score (or raw score if equal)
  results.sort((a, b) => b.averageNormalizedScore - a.averageNormalizedScore);

  // Assign ranks
  results.forEach((item, index) => {
    item.rank = index + 1;
  });

  return results;
}
