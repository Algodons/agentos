import { Agent, createLog, AgentLog } from './types';
import { PromptSanitizer } from '../security/PromptSanitizer';
import { InjectionDetector } from '../security/InjectionDetector';

export interface SecurityAgentInput {
  prompt: string;
}

export interface SecurityAgentOutput {
  securedPrompt: string;
  threatDetected: boolean;
  threats: string[];
  logs: AgentLog[];
}

/**
 * SecurityAgent — sanitizes prompts and detects injection / jailbreak attempts.
 */
export class SecurityAgent implements Agent<SecurityAgentInput, SecurityAgentOutput> {
  readonly name = 'SecurityAgent';
  private readonly sanitizer = new PromptSanitizer();
  private readonly detector = new InjectionDetector();

  async execute(input: SecurityAgentInput): Promise<SecurityAgentOutput> {
    const logs: AgentLog[] = [];

    const threats = this.detector.detect(input.prompt);
    const threatDetected = threats.length > 0;

    if (threatDetected) {
      logs.push(
        createLog(this.name, 'warn', 'Threat detected in prompt', { threats }),
      );
    }

    const securedPrompt = this.sanitizer.sanitize(input.prompt);
    logs.push(createLog(this.name, 'info', 'Prompt secured', { threatDetected }));

    return { securedPrompt, threatDetected, threats, logs };
  }
}
