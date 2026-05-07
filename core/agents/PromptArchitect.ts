import { Agent, createLog, AgentLog } from './types';

export interface PromptDNASection {
  intent: string;
  context: string;
  constraints: string;
  outputFormat: string;
  evaluationCriteria: string;
  edgeCases: string;
}

export interface PromptArchitectInput {
  sanitizedInput: string;
}

export interface PromptArchitectOutput {
  prompt: string;
  dna: PromptDNASection;
  logs: AgentLog[];
}

/**
 * PromptArchitect — constructs a structured prompt following the Prompt DNA standard:
 * [INTENT] [CONTEXT] [CONSTRAINTS] [OUTPUT FORMAT] [EVALUATION CRITERIA] [EDGE CASES]
 */
export class PromptArchitect implements Agent<PromptArchitectInput, PromptArchitectOutput> {
  readonly name = 'PromptArchitect';

  async execute(input: PromptArchitectInput): Promise<PromptArchitectOutput> {
    const logs: AgentLog[] = [];

    const dna: PromptDNASection = {
      intent: `Complete the following task accurately and concisely: ${input.sanitizedInput}`,
      context: 'You are a highly capable AI assistant operating within AgentOS.',
      constraints:
        'Be factual. Do not hallucinate. Stay on topic. Use clear, professional language.',
      outputFormat: 'Respond in structured plain text unless JSON is explicitly requested.',
      evaluationCriteria: 'Accuracy, completeness, determinism, and cost-efficiency.',
      edgeCases: 'If the request is ambiguous, ask for clarification rather than guessing.',
    };

    const prompt = [
      `[INTENT]\n${dna.intent}`,
      `[CONTEXT]\n${dna.context}`,
      `[CONSTRAINTS]\n${dna.constraints}`,
      `[OUTPUT FORMAT]\n${dna.outputFormat}`,
      `[EVALUATION CRITERIA]\n${dna.evaluationCriteria}`,
      `[EDGE CASES]\n${dna.edgeCases}`,
    ].join('\n\n');

    logs.push(createLog(this.name, 'info', 'Prompt constructed', { promptLength: prompt.length }));

    return { prompt, dna, logs };
  }
}
