/**
 * Core Agent interface — all agents must implement this contract.
 * Agents are stateless, fully typed, and return deterministic outputs.
 */
export interface Agent<I, O> {
  readonly name: string;
  execute(input: I): Promise<O>;
}

/** Structured log entry emitted by agents */
export interface AgentLog {
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, unknown>;
}

/** Creates a structured log entry */
export function createLog(
  agent: string,
  level: AgentLog['level'],
  message: string,
  data?: Record<string, unknown>,
): AgentLog {
  return {
    timestamp: new Date().toISOString(),
    agent,
    level,
    message,
    ...(data !== undefined ? { data } : {}),
  };
}
