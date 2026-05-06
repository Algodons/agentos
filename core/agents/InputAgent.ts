import { Agent, createLog, AgentLog } from './types';

export interface InputAgentInput {
  raw: string;
}

export interface InputAgentOutput {
  sanitizedInput: string;
  metadata: {
    length: number;
    language: string;
    timestamp: string;
  };
  logs: AgentLog[];
}

/**
 * InputAgent — validates and normalises raw user input before processing.
 */
export class InputAgent implements Agent<InputAgentInput, InputAgentOutput> {
  readonly name = 'InputAgent';

  async execute(input: InputAgentInput): Promise<InputAgentOutput> {
    const logs: AgentLog[] = [];

    if (!input.raw || input.raw.trim().length === 0) {
      logs.push(createLog(this.name, 'error', 'Empty input received'));
      throw new Error('InputAgent: input must not be empty');
    }

    const sanitizedInput = input.raw.trim().slice(0, 10_000);
    logs.push(createLog(this.name, 'info', 'Input accepted', { length: sanitizedInput.length }));

    return {
      sanitizedInput,
      metadata: {
        length: sanitizedInput.length,
        language: 'en',
        timestamp: new Date().toISOString(),
      },
      logs,
    };
  }
}
