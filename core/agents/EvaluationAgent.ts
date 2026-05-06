import { Agent, createLog, AgentLog } from './types';
import { ScoreBreakdown, ScoringEngine } from '../evaluation/ScoringEngine';

export interface EvaluationAgentInput {
  prompt: string;
  response: string;
  latencyMs: number;
  estimatedCostUsd: number;
}

export interface EvaluationAgentOutput {
  score: number;
  breakdown: ScoreBreakdown;
  passed: boolean;
  logs: AgentLog[];
}

/**
 * EvaluationAgent — scores a model response against the weighted scoring formula.
 */
export class EvaluationAgent implements Agent<EvaluationAgentInput, EvaluationAgentOutput> {
  readonly name = 'EvaluationAgent';
  private readonly scoringEngine = new ScoringEngine();
  private readonly passThreshold = 0.95;

  async execute(input: EvaluationAgentInput): Promise<EvaluationAgentOutput> {
    const logs: AgentLog[] = [];

    const { score, breakdown } = this.scoringEngine.score({
      prompt: input.prompt,
      response: input.response,
      latencyMs: input.latencyMs,
      estimatedCostUsd: input.estimatedCostUsd,
    });

    const passed = score >= this.passThreshold;

    logs.push(
      createLog(this.name, 'info', 'Evaluation complete', { score, passed }),
    );

    return { score, breakdown, passed, logs };
  }
}
