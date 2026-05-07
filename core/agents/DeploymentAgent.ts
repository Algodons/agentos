import { Agent, createLog, AgentLog } from './types';
import { MemorySystem } from '../memory/MemorySystem';

export interface DeploymentAgentInput {
  prompt: string;
  response: string;
  score: number;
  model: string;
  iterations: number;
}

export interface DeploymentAgentOutput {
  versionId: string;
  deployed: boolean;
  canRollback: boolean;
  abTestVariants: number;
  logs: AgentLog[];
}

/**
 * DeploymentAgent — persists the best prompt version with full metadata.
 * Supports rollback and A/B testing scaffolding.
 */
export class DeploymentAgent implements Agent<DeploymentAgentInput, DeploymentAgentOutput> {
  readonly name = 'DeploymentAgent';
  private readonly memory = MemorySystem.getInstance();

  async execute(input: DeploymentAgentInput): Promise<DeploymentAgentOutput> {
    const logs: AgentLog[] = [];

    const versionId = this.memory.savePromptVersion({
      prompt: input.prompt,
      response: input.response,
      score: input.score,
      model: input.model,
      iterations: input.iterations,
      timestamp: new Date().toISOString(),
    });

    const history = this.memory.getLongTermHistory();
    const canRollback = history.length > 1;
    const abTestVariants = Math.min(history.length, 2);

    logs.push(
      createLog(this.name, 'info', 'Prompt version deployed', {
        versionId,
        score: input.score,
        model: input.model,
      }),
    );

    return { versionId, deployed: true, canRollback, abTestVariants, logs };
  }
}
