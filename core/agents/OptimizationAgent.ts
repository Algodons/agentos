import { Agent, createLog, AgentLog } from './types';

export interface OptimizationAgentInput {
  prompt: string;
  score: number;
  iteration: number;
}

export interface OptimizationAgentOutput {
  optimizedPrompt: string;
  strategy: string;
  logs: AgentLog[];
}

/** Mutation strategies applied in sequence across iterations */
const STRATEGIES = [
  'constraint_injection',
  'ambiguity_removal',
  'output_format_enforcement',
  'context_enrichment',
  'redundancy_pruning',
] as const;

type Strategy = (typeof STRATEGIES)[number];

/**
 * OptimizationAgent — mutates a prompt to improve its score.
 * Cycles through strategies: constraint injection → ambiguity removal → format enforcement.
 */
export class OptimizationAgent implements Agent<OptimizationAgentInput, OptimizationAgentOutput> {
  readonly name = 'OptimizationAgent';

  async execute(input: OptimizationAgentInput): Promise<OptimizationAgentOutput> {
    const logs: AgentLog[] = [];
    const strategy = STRATEGIES[input.iteration % STRATEGIES.length];

    const optimizedPrompt = this.applyMutation(input.prompt, strategy);

    logs.push(
      createLog(this.name, 'info', 'Prompt mutated', {
        strategy,
        iteration: input.iteration,
        previousScore: input.score,
      }),
    );

    return { optimizedPrompt, strategy, logs };
  }

  private applyMutation(prompt: string, strategy: Strategy): string {
    switch (strategy) {
      case 'constraint_injection':
        return `${prompt}\n\n[CONSTRAINT] Provide a response that is accurate, concise, and verifiable.`;
      case 'ambiguity_removal':
        return prompt.replace(/\b(it|this|that|they)\b/gi, '[SUBJECT]').replace(
          /\[SUBJECT\]/g,
          'the subject',
        );
      case 'output_format_enforcement':
        return `${prompt}\n\n[FORMAT] Structure your response with clear sections and numbered points where applicable.`;
      case 'context_enrichment':
        return `${prompt}\n\n[ENRICHMENT] Consider edge cases, assumptions, and alternative interpretations.`;
      case 'redundancy_pruning':
        // Remove duplicate lines
        return Array.from(new Set(prompt.split('\n'))).join('\n');
      default:
        return prompt;
    }
  }
}
