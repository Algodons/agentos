import { v4 as uuidv4 } from 'uuid';

export interface PromptVersion {
  versionId: string;
  prompt: string;
  response: string;
  score: number;
  model: string;
  iterations: number;
  timestamp: string;
}

export interface ShortTermContext {
  sessionId: string;
  entries: Array<{ key: string; value: unknown }>;
}

/**
 * MemorySystem — manages short-term (per-request) and long-term (persistent) memory.
 * Implemented as a singleton so the same store is shared across agents in a request.
 */
export class MemorySystem {
  private static instance: MemorySystem;

  private longTermHistory: PromptVersion[] = [];
  private shortTermContext: ShortTermContext = { sessionId: '', entries: [] };

  private constructor() {}

  static getInstance(): MemorySystem {
    if (!MemorySystem.instance) {
      MemorySystem.instance = new MemorySystem();
    }
    return MemorySystem.instance;
  }

  /** Resets short-term context for a new request session. */
  startSession(): string {
    const sessionId = uuidv4();
    this.shortTermContext = { sessionId, entries: [] };
    return sessionId;
  }

  setContext(key: string, value: unknown): void {
    this.shortTermContext.entries.push({ key, value });
  }

  getContext(key: string): unknown | undefined {
    return this.shortTermContext.entries.find((e) => e.key === key)?.value;
  }

  /** Saves a prompt version and returns its versionId. */
  savePromptVersion(
    version: Omit<PromptVersion, 'versionId'>,
  ): string {
    const versionId = uuidv4();
    this.longTermHistory.push({ versionId, ...version });
    // Keep only the last 1 000 versions to prevent unbounded growth
    if (this.longTermHistory.length > 1_000) {
      this.longTermHistory = this.longTermHistory.slice(-1_000);
    }
    return versionId;
  }

  getLongTermHistory(): PromptVersion[] {
    return [...this.longTermHistory];
  }

  getBestVersion(): PromptVersion | null {
    if (this.longTermHistory.length === 0) return null;
    return this.longTermHistory.reduce((best, v) => (v.score > best.score ? v : best));
  }

  /** Rolls back to a previously saved version by versionId. */
  rollbackTo(versionId: string): PromptVersion | null {
    return this.longTermHistory.find((v) => v.versionId === versionId) ?? null;
  }

  /** Clears all state (used in tests). */
  reset(): void {
    this.longTermHistory = [];
    this.shortTermContext = { sessionId: '', entries: [] };
  }
}
