import { InputAgent } from '../agents/InputAgent';
import { PromptArchitect } from '../agents/PromptArchitect';
import { SecurityAgent } from '../agents/SecurityAgent';
import { ExecutionAgent } from '../agents/ExecutionAgent';
import { EvaluationAgent } from '../agents/EvaluationAgent';
import { OptimizationAgent } from '../agents/OptimizationAgent';
import { DeploymentAgent } from '../agents/DeploymentAgent';
import { AgentLog } from '../agents/types';
import { MemorySystem } from '../memory/MemorySystem';
import { ScoreBreakdown } from '../evaluation/ScoringEngine';

export interface SwarmInput {
  raw: string;
  model?: string;
}

export interface SwarmResult {
  finalPrompt: string;
  response: string;
  score: number;
  model: string;
  iterations: number;
  versionId: string;
  threatDetected: boolean;
  scoreBreakdown: ScoreBreakdown;
  logs: AgentLog[];
}

const MAX_ITERATIONS = 10;
const SCORE_THRESHOLD = 0.95;

/**
 * SwarmOrchestrator — the central pipeline coordinator.
 *
 * Pipeline:
 *   Input → PromptArchitect → Security → Execution → Evaluation → [Optimization loop] → Deployment
 */
export class SwarmOrchestrator {
  private readonly inputAgent = new InputAgent();
  private readonly promptArchitect = new PromptArchitect();
  private readonly securityAgent = new SecurityAgent();
  private readonly executionAgent = new ExecutionAgent();
  private readonly evaluationAgent = new EvaluationAgent();
  private readonly optimizationAgent = new OptimizationAgent();
  private readonly deploymentAgent = new DeploymentAgent();
  private readonly memory = MemorySystem.getInstance();

  async run(input: SwarmInput): Promise<SwarmResult> {
    const allLogs: AgentLog[] = [];
    this.memory.startSession();

    // ── Stage 1: Input ────────────────────────────────────────────────────────
    const inputResult = await this.inputAgent.execute({ raw: input.raw });
    allLogs.push(...inputResult.logs);

    // ── Stage 2: Prompt Architecture ─────────────────────────────────────────
    const promptResult = await this.promptArchitect.execute({
      sanitizedInput: inputResult.sanitizedInput,
    });
    allLogs.push(...promptResult.logs);

    // ── Stage 3: Security ─────────────────────────────────────────────────────
    const securityResult = await this.securityAgent.execute({ prompt: promptResult.prompt });
    allLogs.push(...securityResult.logs);

    let currentPrompt = securityResult.securedPrompt;
    let score = 0;
    let response = '';
    let model = input.model ?? 'mock';
    let iterations = 0;
    let scoreBreakdown: ScoreBreakdown = {
      accuracy: 0,
      completeness: 0,
      determinism: 0,
      cost: 0,
      latency: 0,
      total: 0,
    };

    // ── Stage 4–6: Execute → Evaluate → Optimise loop ─────────────────────────
    while (iterations < MAX_ITERATIONS && score < SCORE_THRESHOLD) {
      // Execute
      const executionResult = await this.executionAgent.execute({
        prompt: currentPrompt,
        model,
      });
      allLogs.push(...executionResult.logs);
      response = executionResult.response;
      model = executionResult.model;

      // Evaluate
      const evaluationResult = await this.evaluationAgent.execute({
        prompt: currentPrompt,
        response: executionResult.response,
        latencyMs: executionResult.latencyMs,
        estimatedCostUsd: executionResult.estimatedCostUsd,
      });
      allLogs.push(...evaluationResult.logs);
      score = evaluationResult.score;
      scoreBreakdown = evaluationResult.breakdown;

      iterations++;

      if (score >= SCORE_THRESHOLD) break;

      // Optimise
      const optimizationResult = await this.optimizationAgent.execute({
        prompt: currentPrompt,
        score,
        iteration: iterations,
      });
      allLogs.push(...optimizationResult.logs);
      currentPrompt = optimizationResult.optimizedPrompt;
    }

    // ── Stage 7: Deploy ───────────────────────────────────────────────────────
    const deploymentResult = await this.deploymentAgent.execute({
      prompt: currentPrompt,
      response,
      score,
      model,
      iterations,
    });
    allLogs.push(...deploymentResult.logs);

    return {
      finalPrompt: currentPrompt,
      response,
      score,
      model,
      iterations,
      versionId: deploymentResult.versionId,
      threatDetected: securityResult.threatDetected,
      scoreBreakdown,
      logs: allLogs,
    };
  }
}
