/**
 * AgentOS — Agent Operating System
 *
 * Public surface of the core library.
 *
 * Backward-compatibility export:
 *   import { PromptOS } from '@/core'   // still works
 */

export { SwarmOrchestrator } from './swarm/SwarmOrchestrator';
export type { SwarmInput, SwarmResult } from './swarm/SwarmOrchestrator';

export * from './agents';

export { ScoringEngine } from './evaluation/ScoringEngine';
export type { ScoreBreakdown, ScoringInput } from './evaluation/ScoringEngine';

export { MemorySystem } from './memory/MemorySystem';
export type { PromptVersion, ShortTermContext } from './memory/MemorySystem';

export { PromptSanitizer } from './security/PromptSanitizer';
export { InjectionDetector } from './security/InjectionDetector';

export { ModelRouter } from './models/ModelRouter';
export type { ModelProvider, ModelRequest, ModelResponse } from './models/ModelRouter';

export { WasmRunner } from './wasm/wasmRunner';
export type { WasmTask, WasmTaskResult } from './wasm/wasmRunner';

export { WorkerPool } from './wasm/workerPool';

// ─── Backward-compatibility layer ────────────────────────────────────────────
// Consumers that imported PromptOS continue to work without changes.
export { SwarmOrchestrator as PromptOS } from './swarm/SwarmOrchestrator';
