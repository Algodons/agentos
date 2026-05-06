export interface ScoreBreakdown {
  accuracy: number;
  completeness: number;
  determinism: number;
  cost: number;
  latency: number;
  total: number;
}

export interface ScoringInput {
  prompt: string;
  response: string;
  latencyMs: number;
  estimatedCostUsd: number;
}

/**
 * ScoringEngine — computes a weighted quality score for a prompt/response pair.
 *
 * Formula:
 *   score = (accuracy * 0.40) + (completeness * 0.25) + (determinism * 0.15)
 *         + (cost * 0.10)    + (latency * 0.10)
 *
 * All component scores are normalised to [0, 1].
 */
export class ScoringEngine {
  private readonly weights = {
    accuracy: 0.40,
    completeness: 0.25,
    determinism: 0.15,
    cost: 0.10,
    latency: 0.10,
  } as const;

  score(input: ScoringInput): { score: number; breakdown: ScoreBreakdown } {
    const accuracy = this.scoreAccuracy(input.prompt, input.response);
    const completeness = this.scoreCompleteness(input.response);
    const determinism = this.scoreDeterminism(input.response);
    const cost = this.scoreCost(input.estimatedCostUsd);
    const latency = this.scoreLatency(input.latencyMs);

    const total =
      accuracy * this.weights.accuracy +
      completeness * this.weights.completeness +
      determinism * this.weights.determinism +
      cost * this.weights.cost +
      latency * this.weights.latency;

    const breakdown: ScoreBreakdown = {
      accuracy: round(accuracy),
      completeness: round(completeness),
      determinism: round(determinism),
      cost: round(cost),
      latency: round(latency),
      total: round(total),
    };

    return { score: round(total), breakdown };
  }

  /** Measures how well the response addresses the prompt (heuristic). */
  private scoreAccuracy(prompt: string, response: string): number {
    if (!response || response.trim().length === 0) return 0;
    const promptWords = new Set(prompt.toLowerCase().match(/\b\w{4,}\b/g) ?? []);
    const responseWords = new Set(response.toLowerCase().match(/\b\w{4,}\b/g) ?? []);
    if (promptWords.size === 0) return 0.5;
    let overlap = 0;
    promptWords.forEach((word) => {
      if (responseWords.has(word)) overlap++;
    });
    return Math.min(1, (overlap / promptWords.size) * 2);
  }

  /** Measures response completeness by length heuristic. */
  private scoreCompleteness(response: string): number {
    const words = (response.match(/\b\w+\b/g) ?? []).length;
    if (words >= 100) return 1.0;
    if (words >= 50) return 0.85;
    if (words >= 20) return 0.65;
    if (words >= 5) return 0.4;
    return 0.1;
  }

  /** Penalises non-deterministic markers (random UUIDs, timestamps, etc.). */
  private scoreDeterminism(response: string): number {
    const nondeterministicPatterns = [
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    ];
    const penaltyPerMatch = 0.1;
    let penalty = 0;
    for (const pattern of nondeterministicPatterns) {
      if (pattern.test(response)) penalty += penaltyPerMatch;
    }
    return Math.max(0, 1 - penalty);
  }

  /** Lower cost → higher score. Normalised against a $0.01 ceiling. */
  private scoreCost(estimatedCostUsd: number): number {
    const maxCost = 0.01;
    return Math.max(0, 1 - estimatedCostUsd / maxCost);
  }

  /** Lower latency → higher score. Normalised against a 5 000 ms ceiling. */
  private scoreLatency(latencyMs: number): number {
    const maxLatencyMs = 5_000;
    return Math.max(0, 1 - latencyMs / maxLatencyMs);
  }
}

function round(value: number, decimals = 4): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
