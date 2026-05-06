import { Agent, createLog, AgentLog } from './types';

export interface ExecutionAgentInput {
  prompt: string;
  model?: string;
}

export interface ExecutionAgentOutput {
  response: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  estimatedCostUsd: number;
  logs: AgentLog[];
}

/**
 * ExecutionAgent — runs the prompt against the configured AI model via ModelRouter.
 * Supports retries with exponential backoff.
 */
export class ExecutionAgent implements Agent<ExecutionAgentInput, ExecutionAgentOutput> {
  readonly name = 'ExecutionAgent';
  private readonly maxRetries = 3;

  async execute(input: ExecutionAgentInput): Promise<ExecutionAgentOutput> {
    const logs: AgentLog[] = [];
    const model = input.model ?? 'mock';
    const start = Date.now();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logs.push(
          createLog(this.name, 'info', `Executing prompt (attempt ${attempt})`, { model }),
        );

        const result = await this.callModel(input.prompt, model);
        const latencyMs = Date.now() - start;

        logs.push(
          createLog(this.name, 'info', 'Execution complete', { latencyMs, model }),
        );

        return { ...result, latencyMs, logs };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const backoffMs = Math.pow(2, attempt) * 100;
        logs.push(
          createLog(this.name, 'warn', `Attempt ${attempt} failed, retrying in ${backoffMs}ms`, {
            error: lastError.message,
          }),
        );
        await sleep(backoffMs);
      }
    }

    throw lastError ?? new Error('ExecutionAgent: all retries exhausted');
  }

  private async callModel(
    prompt: string,
    model: string,
  ): Promise<Omit<ExecutionAgentOutput, 'latencyMs' | 'logs'>> {
    // In production this delegates to ModelRouter. Using a deterministic mock here
    // so the system runs locally without API keys.
    const wordCount = prompt.split(/\s+/).length;
    return {
      response: `[AgentOS Mock Response] Processed ${wordCount} tokens via ${model}. ` +
        `Prompt acknowledged and optimised.`,
      model,
      tokensUsed: wordCount,
      estimatedCostUsd: wordCount * 0.000002,
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
